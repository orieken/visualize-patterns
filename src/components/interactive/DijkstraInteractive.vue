<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start Dijkstra' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <!-- Graph Visualization -->
      <div class="graph-area">
        <svg class="connections" width="100%" height="100%">
          <g v-for="(edge, i) in edges" :key="i">
            <line
              :x1="getNodePos(edge.from).x" :y1="getNodePos(edge.from).y"
              :x2="getNodePos(edge.to).x" :y2="getNodePos(edge.to).y"
              :stroke="edgeColor(edge)" stroke-width="2"
            />
            <!-- Edge Weight Label -->
            <text 
              :x="getMidPoint(edge).x" 
              :y="getMidPoint(edge).y" 
              fill="#64748b"
              font-size="0.75rem"
              font-weight="bold"
              text-anchor="middle"
              dy="-4"
              class="edge-label"
            >{{ edge.weight }}</text>
          </g>
        </svg>
        
        <div v-for="node in nodes" :key="node.id"
          class="node"
          :class="{ 
            visited: visited.has(node.id),
            current: currentNode === node.id,
            processing: processingNode === node.id
          }"
          :style="{ left: node.x + '%', top: node.y + '%' }"
        >
          {{ node.id }}
          <div class="dist-badge" :class="{ infinite: distances[node.id] === Infinity }">
            {{ formatDist(distances[node.id]) }}
          </div>
        </div>
      </div>

      <!-- State Panel -->
      <div class="state-panel">
        <div class="data-structure">
          <div class="label">Priority Queue (Min-Heap)</div>
          <div class="pq-container">
            <div v-if="pq.length === 0" class="empty-placeholder">Empty</div>
            <transition-group name="list">
              <div v-for="(item, idx) in pq" :key="item.node + item.dist + idx" class="pq-item">
                <span class="pq-node">{{ item.node }}</span>
                <span class="pq-dist">{{ item.dist }}</span>
              </div>
            </transition-group>
          </div>
        </div>

        <div class="data-structure">
          <div class="label">Shortest Distances</div>
          <div class="dist-table">
            <div v-for="node in nodes" :key="node.id" class="dist-row" :class="{ updated: justUpdated === node.id }">
              <span class="row-node">{{ node.id }}:</span>
              <span class="row-val">{{ formatDist(distances[node.id]) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Node { id: string; x: number; y: number; neighbors: { id: string; weight: number }[] }
interface Edge { from: string; to: string; weight: number }
interface PQItem { node: string; dist: number }

const nodes: Node[] = [
  { id: 'S', x: 20, y: 50, neighbors: [{ id: 'A', weight: 4 }, { id: 'B', weight: 2 }] },
  { id: 'A', x: 50, y: 20, neighbors: [{ id: 'C', weight: 3 }] },
  { id: 'B', x: 50, y: 80, neighbors: [{ id: 'A', weight: 1 }, { id: 'C', weight: 6 }] }, // B->A is key shortcut
  { id: 'C', x: 80, y: 50, neighbors: [] },
];

const edges = computed(() => {
  const result: Edge[] = [];
  nodes.forEach(node => {
    node.neighbors.forEach(n => {
      result.push({ from: node.id, to: n.id, weight: n.weight });
    });
  });
  return result;
});

const getNodePos = (id: string) => {
  const node = nodes.find(n => n.id === id);
  return node ? { x: `${node.x}%`, y: `${node.y}%` } : { x: '0%', y: '0%' };
};

const getMidPoint = (edge: Edge) => {
  const start = getNodePos(edge.from);
  const end = getNodePos(edge.to);
  const x1 = parseFloat(start.x);
  const y1 = parseFloat(start.y);
  const x2 = parseFloat(end.x);
  const y2 = parseFloat(end.y);
  return { x: `${(x1 + x2) / 2}%`, y: `${(y1 + y2) / 2}%` };
};

const formatDist = (d: number) => d === Infinity ? '∞' : d;

// State
const pq = ref<PQItem[]>([]);
const distances = ref<Record<string, number>>({});
const visited = ref<Set<string>>(new Set());
const currentNode = ref<string | null>(null);
const processingNode = ref<string | null>(null); // Neighbor being looked at
const activeEdge = ref<Edge | null>(null);
const logs = ref<string[]>(['Ready. Initial distances: S=0, others=∞.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
const justUpdated = ref<string | null>(null);

let autoPlayInterval: number | null = null;
type StepPhase = 'POP' | 'NEIGHBORS';
let phase: StepPhase = 'POP';
let neighborIndex = 0;

// Initialize distances map
nodes.forEach(n => distances.value[n.id] = Infinity);
distances.value['S'] = 0;

const reset = () => {
  pq.value = [];
  Object.keys(distances.value).forEach(k => distances.value[k] = Infinity);
  distances.value['S'] = 0;
  visited.value = new Set();
  currentNode.value = null;
  processingNode.value = null;
  activeEdge.value = null;
  logs.value = ['Ready. Initial distances: S=0, others=∞.'];
  isStarted.value = false;
  isFinished.value = false;
  justUpdated.value = null;
  phase = 'POP';
  neighborIndex = 0;
  stopAuto();
};

const edgeColor = (edge: Edge) => {
  if (activeEdge.value && activeEdge.value.from === edge.from && activeEdge.value.to === edge.to) return '#2563eb';
  return '#cbd5e1';
};

const stopAuto = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isAutoPlaying.value = false;
  }
};

const toggleAuto = () => {
  if (isAutoPlaying.value) {
    stopAuto();
  } else {
    isAutoPlaying.value = true;
    nextStep();
    autoPlayInterval = setInterval(() => {
      if (isFinished.value) stopAuto();
      else nextStep();
    }, 1500) as unknown as number;
  }
};

const nextStep = () => {
  if (isFinished.value) return;

  justUpdated.value = null;

  if (!isStarted.value) {
    isStarted.value = true;
    pq.value = [{ node: 'S', dist: 0 }];
    logs.value.push('Started. Pushed (S, 0) to Priority Queue.');
    return;
  }

  if (phase === 'POP') {
    activeEdge.value = null;
    processingNode.value = null;

    if (pq.value.length === 0) {
      logs.value.push('Priority Queue empty. Algorithm complete.');
      isFinished.value = true;
      currentNode.value = null;
      return;
    }

    // Sort PQ (simulate min-heap pop)
    pq.value.sort((a, b) => a.dist - b.dist);
    const item = pq.value.shift()!;
    
    // Check for stale entries (if we've already visited this node with a shorter distance)
    if (visited.value.has(item.node)) {
      logs.value.push(`Popped stale entry (${item.node}, ${item.dist}). Skipping.`);
      // Recursive call to skip step visually or just show "Skipping"
      return; 
    }

    currentNode.value = item.node;
    visited.value.add(item.node);
    phase = 'NEIGHBORS';
    neighborIndex = 0;
    logs.value.push(`Popped node ${item.node} with distance ${item.dist}. Checking neighbors...`);
  } else {
    // Processing neighbors
    const current = nodes.find(n => n.id === currentNode.value)!;
    
    if (neighborIndex >= current.neighbors.length) {
      logs.value.push(`Finished all neighbors of ${current.id}.`);
      phase = 'POP';
      currentNode.value = null; // Visually deselect
      return;
    }

    const neighbor = current.neighbors[neighborIndex];
    neighborIndex++;
    
    processingNode.value = neighbor.id;
    activeEdge.value = { from: current.id, to: neighbor.id, weight: neighbor.weight };
    
    const newDist = distances.value[current.id] + neighbor.weight;
    const oldDist = distances.value[neighbor.id];
    
    if (newDist < oldDist) {
      distances.value[neighbor.id] = newDist;
      pq.value.push({ node: neighbor.id, dist: newDist });
      // Keep sort for visual consistency
      pq.value.sort((a, b) => a.dist - b.dist);
      
      justUpdated.value = neighbor.id;
      logs.value.push(`Relaxed edge ${current.id}→${neighbor.id}. Updated ${neighbor.id} dist: ${formatDist(oldDist)} → ${newDist}.`);
    } else {
      logs.value.push(`Edge ${current.id}→${neighbor.id} (${newDist}) is not shorter than current ${formatDist(oldDist)}. No update.`);
    }
  }
};
</script>

<style scoped>
.interactive-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.action-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #0284c7; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #0ea5e9;
  border: 1px solid #0ea5e9;
}

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-left: auto;
}

.visualization-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
  height: 320px;
}

.graph-area {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.edge-label {
  background: white; /* Doesnt work in SVG text easily, requires rect filter usually. */
  text-shadow: 
    -1px -1px 0 #fff,  
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff;
}

.node {
  position: absolute;
  width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid #94a3b8;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
  color: #334155;
  transition: all 0.3s ease;
  z-index: 10;
}

.node.visited {
  border-color: #0ea5e9;
  background: #f0f9ff;
  color: #0369a1;
}

.node.current {
  border-color: #0ea5e9;
  background: #e0f2fe;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 20;
}

.node.processing {
  border-color: #f59e0b; /* Orange for target being checked */
  color: #b45309;
}

.dist-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #0f172a;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  min-width: 1.2rem;
  text-align: center;
}

.dist-badge.infinite {
  background: #94a3b8;
}

.state-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-structure {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.pq-container {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-height: 2rem;
  max-height: 120px;
  overflow-y: auto;
}

.pq-item {
  display: flex;
  justify-content: space-between;
  background: #e0f2fe;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #0369a1;
  font-weight: 600;
}

.dist-table {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.dist-row {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0.4rem;
  font-size: 0.85rem;
  color: #475569;
}

.dist-row.updated {
  background: #bbf7d0; /* Green flash */
  border-radius: 4px;
  animation: flash 1s forwards;
}

@keyframes flash {
  0% { background: #bbf7d0; }
  100% { background: transparent; }
}

.console {
  background: #0f172a;
  color: #0ea5e9;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 120px;
  overflow-y: auto;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.log-entry {
  opacity: 0.9;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 0.1rem 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
