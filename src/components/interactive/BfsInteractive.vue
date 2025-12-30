<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start BFS' }}
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
          <line v-for="(edge, i) in edges" :key="i"
            :x1="getNodePos(edge.from).x" :y1="getNodePos(edge.from).y"
            :x2="getNodePos(edge.to).x" :y2="getNodePos(edge.to).y"
            stroke="#cbd5e1" stroke-width="2"
          />
        </svg>
        
        <div v-for="node in nodes" :key="node.id"
          class="node"
          :class="{ 
            visited: visited.has(node.id),
            current: currentNode === node.id,
            queued: queue.includes(node.id) && currentNode !== node.id
          }"
          :style="{ left: node.x + '%', top: node.y + '%' }"
        >
          {{ node.id }}
        </div>
      </div>

      <!-- State Panel -->
      <div class="state-panel">
        <div class="data-structure">
          <div class="label">Queue (FIFO)</div>
          <div class="queue-container">
            <div v-if="queue.length === 0" class="empty-placeholder">Empty</div>
            <transition-group name="list">
              <div v-for="id in queue" :key="id" class="queue-item">{{ id }}</div>
            </transition-group>
          </div>
        </div>

        <div class="data-structure">
          <div class="label">Visited Set</div>
          <div class="visited-container">
            <span v-for="id in Array.from(visited)" :key="id" class="visited-item">{{ id }}</span>
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

const nodes: Node[] = [
  { id: 'S', x: 50, y: 15, neighbors: ['A', 'B'] },
  { id: 'A', x: 25, y: 50, neighbors: ['C', 'D'] },
  { id: 'B', x: 75, y: 50, neighbors: ['D', 'E'] },
  { id: 'C', x: 15, y: 85, neighbors: [] },
  { id: 'D', x: 50, y: 85, neighbors: [] },
  { id: 'E', x: 85, y: 85, neighbors: [] },
];

const edges = computed(() => {
  const result: Edge[] = [];
  nodes.forEach(node => {
    node.neighbors.forEach(neighborId => {
      // Avoid duplicates for undirected graph visual, though here it's directed logic but visual is simple
      // For visual simplicity, draw line if target exists
      if (nodes.find(n => n.id === neighborId)) {
        result.push({ from: node.id, to: neighborId });
      }
    });
  });
  return result;
});

const getNodePos = (id: string) => {
  const node = nodes.find(n => n.id === id);
  return node ? { x: `${node.x}%`, y: `${node.y}%` } : { x: '0%', y: '0%' };
};

// State
const queue = ref<string[]>([]);
const visited = ref<Set<string>>(new Set());
const currentNode = ref<string | null>(null);
const logs = ref<string[]>(['Ready to start BFS from node S.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);

let autoPlayInterval: number | null = null;
let processingNeighbors = false; // Sub-step state

const reset = () => {
  queue.value = [];
  visited.value = new Set();
  currentNode.value = null;
  logs.value = ['Ready to start BFS from node S.'];
  isStarted.value = false;
  isFinished.value = false;
  processingNeighbors = false;
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
    // Initial Step
    isStarted.value = true;
    queue.value.push('S'); // Start at S
    visited.value.add('S');
    logs.value.push('Initialized queue with start node [S].');
    return;
  }

  // Two phases: Pop/Visit OR process neighbors
  if (currentNode.value && !processingNeighbors) {
    // We have a current node, time to process its neighbors
    const current = nodes.find(n => n.id === currentNode.value)!;
    const unvisitedNeighbors = current.neighbors.filter(n => !visited.value.has(n));
    
    if (unvisitedNeighbors.length > 0) {
      logs.value.push(`found neighbors of ${current.id}: [${unvisitedNeighbors.join(', ')}]`);
      unvisitedNeighbors.forEach(n => {
        visited.value.add(n);
        queue.value.push(n);
      });
      logs.value.push(`Added [${unvisitedNeighbors.join(', ')}] to queue.`);
    } else {
      logs.value.push(`No unvisited neighbors for ${current.id}.`);
    }
    
    processingNeighbors = true; // Done processing
  } else {
    // Pop from queue
    if (queue.value.length === 0) {
      logs.value.push('Queue is empty. BFS Complete.');
      isFinished.value = true;
      currentNode.value = null;
      return;
    }

    // Actually pop
    if (currentNode.value && processingNeighbors) {
        // We just finished processing previous node, clear it visually from "current" focus
        // But in BFS, we usually just loop.
    }
    
    const next = queue.value.shift()!;
    currentNode.value = next;
    processingNeighbors = false;
    logs.value.push(`Dequeued ${next}. Visiting...`);
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
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #1d4ed8; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #2563eb;
  border: 1px solid #2563eb;
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

.node {
  position: absolute;
  width: 40px;
  height: 40px;
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
  border-color: #64748b;
  background: #f1f5f9;
  color: #64748b;
}

.node.queued {
  border-color: #f59e0b;
  background: #fef3c7;
  color: #b45309;
  transform: translate(-50%, -50%) scale(1.1);
}

.node.current {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
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

.queue-container {
  display: flex;
  gap: 0.4rem;
  min-height: 2rem;
  align-items: center;
  overflow-x: auto;
}

.queue-item {
  background: #f59e0b;
  color: white;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.visited-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.visited-item {
  color: #64748b;
  font-family: monospace;
  background: #e2e8f0;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.console {
  background: #0f172a;
  color: #38bdf8;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 120px;
  overflow-y: auto;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column-reverse; /* Keep newest at bottom usually, but flex-col-reverse puts bottom at top? No. */
  flex-direction: column;
}

.log-entry {
  opacity: 0.9;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 0.1rem 0;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
