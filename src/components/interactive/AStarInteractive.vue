<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start A*' }}
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
            <text 
              :x="getMidPoint(edge).x" 
              :y="getMidPoint(edge).y" 
              fill="#64748b"
              font-size="0.75rem"
              font-weight="bold"
              text-anchor="middle"
              dy="-4"
              class="edge-label"
            >g={{ edge.weight }}</text>
          </g>
        </svg>
        
        <div v-for="node in nodes" :key="node.id"
          class="node"
          :class="{ 
            visited: visited.has(node.id),
            current: currentNode === node.id,
            goal: node.id === 'G'
          }"
          :style="{ left: node.x + '%', top: node.y + '%' }"
        >
          {{ node.id }}
          <div class="h-badge">h={{ node.h }}</div>
          <div class="stats-badge" v-if="gScores[node.id] !== Infinity">
            f={{ gScores[node.id] + node.h }}
          </div>
        </div>
      </div>

      <!-- State Panel -->
      <div class="state-panel">
        <div class="data-structure">
          <div class="label">Priority Queue (f = g + h)</div>
          <div class="pq-container">
            <div v-if="pq.length === 0" class="empty-placeholder">Empty</div>
            <transition-group name="list">
              <div v-for="(item, idx) in pq" :key="item.node + idx" class="pq-item">
                <span class="pq-node">{{ item.node }}</span>
                <span class="pq-vals">g{{ item.g }}+h{{ nodes.find(n=>n.id===item.node)?.h }} = 
                  <strong>f{{ item.f }}</strong>
                </span>
              </div>
            </transition-group>
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

interface Node { id: string; x: number; y: number; h: number; neighbors: { id: string; weight: number }[] }
interface Edge { from: string; to: string; weight: number }
interface PQItem { node: string; f: number; g: number }

const nodes: Node[] = [
  { id: 'S', x: 15, y: 50, h: 6, neighbors: [{ id: 'A', weight: 1 }, { id: 'B', weight: 3 }] },
  { id: 'A', x: 40, y: 15, h: 9, neighbors: [{ id: 'C', weight: 2 }] }, // "Trap" - looks close (g=1) but h=9 implies far
  { id: 'B', x: 50, y: 50, h: 3, neighbors: [{ id: 'G', weight: 3 }] }, // "Good path" - g=3 but h=3 implies closer
  { id: 'C', x: 70, y: 15, h: 8, neighbors: [] }, // Dead end
  { id: 'G', x: 85, y: 50, h: 0, neighbors: [] },
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
  return { 
    x: `${(parseFloat(start.x) + parseFloat(end.x)) / 2}%`, 
    y: `${(parseFloat(start.y) + parseFloat(end.y)) / 2}%` 
  };
};

// State
const pq = ref<PQItem[]>([]);
const gScores = ref<Record<string, number>>({});
const visited = ref<Set<string>>(new Set());
const currentNode = ref<string | null>(null);
const activeEdge = ref<Edge | null>(null);
const logs = ref<string[]>(['Ready. Heuristics (h) are fixed estimates to Goal.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);

let autoPlayInterval: number | null = null;
type Phase = 'POP' | 'NEIGHBOR_CHECK';
let phase: Phase = 'POP';
let neighborIdx = 0;

nodes.forEach(n => gScores.value[n.id] = Infinity);
gScores.value['S'] = 0;

const reset = () => {
  pq.value = [];
  nodes.forEach(n => gScores.value[n.id] = Infinity);
  gScores.value['S'] = 0;
  visited.value = new Set();
  currentNode.value = null;
  activeEdge.value = null;
  logs.value = ['Ready.'];
  isStarted.value = false;
  isFinished.value = false;
  phase = 'POP';
  neighborIdx = 0;
  stopAuto();
};

const edgeColor = (edge: Edge) => {
  if (activeEdge.value && activeEdge.value.from === edge.from && activeEdge.value.to === edge.to) return '#10b981';
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

  if (!isStarted.value) {
    isStarted.value = true;
    const s = nodes.find(n => n.id === 'S')!;
    pq.value.push({ node: 'S', g: 0, f: s.h }); // f = g + h = 0 + 6
    logs.value.push(`Init: Push S (f=${s.h}) to PQ.`);
    return;
  }

  if (phase === 'POP') {
    activeEdge.value = null;
    if (pq.value.length === 0) {
      logs.value.push('PQ empty. No path found.');
      isFinished.value = true;
      return;
    }

    pq.value.sort((a, b) => a.f - b.f);
    const current = pq.value.shift()!;
    
    if (current.node === 'G') {
      logs.value.push('Goal reached! A* Complete.');
      currentNode.value = 'G';
      isFinished.value = true;
      return;
    }

    currentNode.value = current.node;
    visited.value.add(current.node);
    neighborIdx = 0;
    phase = 'NEIGHBOR_CHECK';
    logs.value.push(`Pop ${current.node} (f=${current.f}). Checking neighbors...`);
  } else {
    const current = nodes.find(n => n.id === currentNode.value)!;
    
    if (neighborIdx >= current.neighbors.length) {
      phase = 'POP';
      currentNode.value = null;
      return;
    }

    const neighborRef = current.neighbors[neighborIdx];
    const neighbor = nodes.find(n => n.id === neighborRef.id)!;
    neighborIdx++;
    
    activeEdge.value = { from: current.id, to: neighbor.id, weight: neighborRef.weight };
    
    const tentativeG = gScores.value[current.id] + neighborRef.weight;
    
    if (tentativeG < gScores.value[neighbor.id]) {
      gScores.value[neighbor.id] = tentativeG;
      const f = tentativeG + neighbor.h;
      pq.value.push({ node: neighbor.id, g: tentativeG, f });
      pq.value.sort((a, b) => a.f - b.f);
      logs.value.push(`${neighbor.id} updated: g=${tentativeG}, h=${neighbor.h} -> f=${f}. Pushed.`);
    } else {
      logs.value.push(`${neighbor.id} not better (new g=${tentativeG} >= old ${gScores.value[neighbor.id]}).`);
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
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #059669; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #10b981;
  border: 1px solid #10b981;
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
  border-color: #10b981;
  background: #ecfdf5;
  color: #047857;
}

.node.current {
  border-color: #10b981;
  background: #d1fae5;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 20;
}

.node.goal {
  border-color: #f59e0b;
  background: #fffbeb;
  color: #d97706;
}

.h-badge {
  position: absolute;
  bottom: -20px;
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
  background: rgba(255,255,255,0.9);
  padding: 0 4px;
  border-radius: 4px;
}

.stats-badge {
  position: absolute;
  top: -14px;
  background: #1e293b;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
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
  max-height: 200px;
  overflow-y: auto;
}

.pq-item {
  display: flex;
  justify-content: space-between;
  background: #d1fae5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #065f46;
}

.pq-vals {
  font-family: monospace;
}

.console {
  background: #0f172a;
  color: #34d399;
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
