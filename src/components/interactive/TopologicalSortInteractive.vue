<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start Topo Sort' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="graph-area">
        <svg class="connections" width="100%" height="100%">
          <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="22" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
             </marker>
             <marker id="arrowhead-active" markerWidth="10" markerHeight="7" 
             refX="22" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
             </marker>
          </defs>
          <line v-for="(edge, i) in edges" :key="i"
            :x1="getNodePos(edge.from).x" :y1="getNodePos(edge.from).y"
            :x2="getNodePos(edge.to).x" :y2="getNodePos(edge.to).y"
            stroke="#cbd5e1" stroke-width="2"
            marker-end="url(#arrowhead)"
            :class="{ active: currentEdge && currentEdge.from === edge.from && currentEdge.to === edge.to }"
          />
        </svg>
        
        <div v-for="node in nodes" :key="node.id"
          class="node"
          :class="{ 
            'zero-in': inDegrees[node.id] === 0 && !sortedSet.has(node.id),
            'sorted': sortedSet.has(node.id),
            'processing': currentNode === node.id
          }"
          :style="{ left: node.x + '%', top: node.y + '%' }"
        >
          {{ node.id }}
          <div class="badge" v-if="!sortedSet.has(node.id)">in={{ inDegrees[node.id] }}</div>
        </div>
      </div>

      <div class="state-panel">
        <div class="data-structure">
          <div class="label">Sorted Order</div>
          <div class="sorted-list">
             <div v-if="sortedList.length === 0" class="empty-placeholder">List empty</div>
             <transition-group name="list">
               <div v-for="id in sortedList" :key="id" class="sorted-item">{{ id }}</div>
             </transition-group>
          </div>
        </div>
        
        <div class="data-structure">
          <div class="label">Zero Degree Queue</div>
          <div class="queue-container">
             <div v-if="queue.length === 0" class="empty-placeholder">Empty</div>
             <transition-group name="list">
               <div v-for="id in queue" :key="id" class="queue-item">{{ id }}</div>
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

interface Node { id: string; x: number; y: number; neighbors: string[] }
interface Edge { from: string; to: string }

// Define a DAG
// A -> C, B -> C, C -> D, C -> E, D -> F
const nodes: Node[] = [
  { id: 'A', x: 20, y: 20, neighbors: ['C'] },
  { id: 'B', x: 20, y: 80, neighbors: ['C'] },
  { id: 'C', x: 50, y: 50, neighbors: ['D', 'E'] },
  { id: 'D', x: 80, y: 30, neighbors: ['F'] },
  { id: 'E', x: 80, y: 70, neighbors: [] },
  { id: 'F', x: 95, y: 50, neighbors: [] }
];

const edges = computed(() => {
  const result: Edge[] = [];
  nodes.forEach(n => {
    n.neighbors.forEach(target => result.push({ from: n.id, to: target }));
  });
  return result;
});

const getNodePos = (id: string) => {
  const n = nodes.find(node => node.id === id);
  return n ? { x: `${n.x}%`, y: `${n.y}%` } : { x: '0%', y: '0%' };
};

// State
const inDegrees = ref<Record<string, number>>({});
const queue = ref<string[]>([]);
const sortedList = ref<string[]>([]);
const sortedSet = ref<Set<string>>(new Set());
const logs = ref<string[]>(['Ready. Kahn’s Algorithm for Topological Sort.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
const currentNode = ref<string|null>(null);
const currentEdge = ref<Edge|null>(null);

let autoPlayInterval: number | null = null;
let neighborIndex = 0;
let phase: 'FIND_ZERO' | 'PROCESS_NODE' | 'PROCESS_NEIGHBORS' = 'FIND_ZERO';

// Init degrees
const initDegrees = () => {
    const map: Record<string, number> = {};
    nodes.forEach(n => map[n.id] = 0);
    edges.value.forEach(e => map[e.to]++);
    inDegrees.value = map;
};
initDegrees();

const reset = () => {
  initDegrees();
  queue.value = [];
  sortedList.value = [];
  sortedSet.value = new Set();
  currentNode.value = null;
  currentEdge.value = null;
  logs.value = ['Ready. Kahn’s Algorithm.'];
  isStarted.value = false;
  isFinished.value = false;
  phase = 'FIND_ZERO';
  neighborIndex = 0;
  stopAuto();
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
      // Initial Step: Find all nodes with 0 in-degree
      const zeros = nodes.filter(n => inDegrees.value[n.id] === 0).map(n => n.id);
      zeros.forEach(id => queue.value.push(id));
      logs.value.push(`Init: Found zero in-degree nodes [${zeros.join(', ')}]. Added to queue.`);
      phase = 'PROCESS_NODE';
      return;
  }

  if (phase === 'PROCESS_NODE') {
      currentEdge.value = null;
      if (queue.value.length === 0) {
          if (sortedList.value.length === nodes.length) {
              logs.value.push('Queue empty & all nodes sorted. Complete.');
          } else {
              logs.value.push('Queue empty but not all sorted (Cycle detected?).');
          }
          isFinished.value = true;
          currentNode.value = null;
          return;
      }
      
      const u = queue.value.shift()!;
      currentNode.value = u;
      sortedList.value.push(u);
      sortedSet.value.add(u);
      logs.value.push(`Pop ${u}. Add to sorted order. Decrementing neighbors...`);
      phase = 'PROCESS_NEIGHBORS';
      neighborIndex = 0;
      return;
  }

  if (phase === 'PROCESS_NEIGHBORS') {
      const uNode = nodes.find(n => n.id === currentNode.value)!;
      if (neighborIndex >= uNode.neighbors.length) {
          logs.value.push(`Finished neighbors of ${currentNode.value}.`);
          currentNode.value = null;
          phase = 'PROCESS_NODE';
          return;
      }

      const v = uNode.neighbors[neighborIndex];
      currentEdge.value = { from: uNode.id, to: v };
      inDegrees.value[v]--;
      logs.value.push(`${uNode.id} -> ${v}: Decrement ${v} in-degree to ${inDegrees.value[v]}.`);
      
      if (inDegrees.value[v] === 0) {
          queue.value.push(v);
          logs.value.push(`${v} has 0 in-degree. Enqueued.`);
      }
      
      neighborIndex++;
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
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #7c3aed; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
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
  height: 300px;
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

.connections line.active {
  stroke: #f59e0b;
  stroke-width: 3;
  marker-end: url(#arrowhead-active);
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

.node.zero-in {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #15803d;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.node.processing {
  border-color: #f59e0b;
  background: #fffbeb;
  color: #b45309;
  transform: translate(-50%, -50%) scale(1.1);
}

.node.sorted {
  border-color: #94a3b8;
  background: #e2e8f0;
  color: #94a3b8;
  opacity: 0.7;
}

.badge {
  position: absolute;
  top: -15px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 0.65rem;
  padding: 0 4px;
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

.sorted-list, .queue-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-height: 2rem;
}

.sorted-item {
  background: #8b5cf6;
  color: white;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 4px;
  font-weight: bold;
}

.queue-item {
  background: #22c55e;
  color: white;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
}

.console {
  background: #0f172a;
  color: #c4b5fd;
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

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
