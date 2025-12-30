<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start DFS' }}
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
            stack: stack.includes(node.id) && currentNode !== node.id
          }"
          :style="{ left: node.x + '%', top: node.y + '%' }"
        >
          {{ node.id }}
        </div>
      </div>

      <!-- State Panel -->
      <div class="state-panel">
        <div class="data-structure">
          <div class="label">Stack (LIFO)</div>
          <div class="stack-container">
            <div v-if="stack.length === 0" class="empty-placeholder">Empty</div>
            <transition-group name="list">
              <!-- Reversed stack for visual representation (Top on top/left) -->
              <div v-for="id in stack.slice().reverse()" :key="id" class="stack-item">{{ id }}</div>
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
const stack = ref<string[]>([]);
const visited = ref<Set<string>>(new Set());
const currentNode = ref<string | null>(null);
const logs = ref<string[]>(['Ready to start DFS from node S.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);

let autoPlayInterval: number | null = null;
let processingNeighbors = false;

const reset = () => {
  stack.value = [];
  visited.value = new Set();
  currentNode.value = null;
  logs.value = ['Ready to start DFS from node S.'];
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
    isStarted.value = true;
    stack.value.push('S');
    visited.value.add('S');
    logs.value.push('Initialized stack with start node [S].');
    return;
  }

  if (currentNode.value && !processingNeighbors) {
    const current = nodes.find(n => n.id === currentNode.value)!;
    // For DFS, we want to visit 'A' before 'B' usually.
    // If neighbors are [A, B] and we push A then B, stack is [..., A, B]. B pops first.
    // So to visit A first, we should push [B, A] -> stack [..., B, A].
    // So reverse neighbors before pushing if we want left-to-right order.
    
    const unvisitedNeighbors = [...current.neighbors]
      .reverse() // Reverse so first neighbor ends up on top of stack
      .filter(n => !visited.value.has(n));
    
    if (unvisitedNeighbors.length > 0) {
      logs.value.push(`Neighbors of ${current.id}: [${current.neighbors.join(', ')}]. Pushing unvisited...`);
      unvisitedNeighbors.forEach(n => {
        if (!visited.value.has(n)) { // Double check inside loop although filter handles it unique adds
           // Strictly speaking DFS usually marks visited upon popping (or pushing). 
           // If we mark on push (like BFS), we avoid dupes in stack. 
           // Let's mark on push to keep visual state clean and simple.
           visited.value.add(n);
           stack.value.push(n);
        }
      });
      logs.value.push(`Pushed [${unvisitedNeighbors.join(', ')}] to stack.`);
    } else {
      logs.value.push(`No unvisited neighbors for ${current.id}. Backtracking...`);
    }
    
    processingNeighbors = true;
  } else {
    if (stack.value.length === 0) {
      logs.value.push('Stack is empty. DFS Complete.');
      isFinished.value = true;
      currentNode.value = null;
      return;
    }

    const next = stack.value.pop()!;
    currentNode.value = next;
    processingNeighbors = false;
    logs.value.push(`Popped ${next}. Visiting...`);
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
  background: #8b5cf6; /* Purple for DFS/Deep */
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

.node.stack {
  border-color: #f59e0b;
  background: #fef3c7;
  color: #b45309;
}

.node.current {
  border-color: #8b5cf6;
  background: #f5f3ff;
  color: #5b21b6;
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
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

.stack-container {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 2rem;
  max-height: 120px;
  overflow-y: auto;
}

.stack-item {
  background: #f59e0b;
  color: white;
  padding: 0.25rem;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
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
  color: #a78bfa;
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
  transform: translateX(-10px);
}
</style>
