<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <button @click="reset">Reset Training</button>
        <button @click="toggleRun">{{ isRunning ? 'Pause' : 'Run Episodes' }}</button>
        <button @click="step" :disabled="isRunning">Step</button>
      </div>
      <div class="stats">
        <div>Episode: <strong>{{ episode }}</strong></div>
        <div>Epsilon: <strong>{{ epsilon.toFixed(2) }}</strong></div>
        <div>Last Reward: <strong>{{ lastReward }}</strong></div>
      </div>
    </div>

    <div class="visualization-container">
      <div class="grid" :style="{ '--rows': rows, '--cols': cols }">
        <div 
          v-for="(cell, index) in grid" 
          :key="index"
          class="cell"
          :class="{
            'agent': currentState === index,
            'goal': index === goalState,
            'hazard': hazards.includes(index),
            'wall': walls.includes(index)
          }"
        >
          <!-- Cell Content (Icons) -->
          <div class="content">
            <span v-if="index === goalState">🏆</span>
            <span v-else-if="hazards.includes(index)">🔥</span>
            <span v-else-if="walls.includes(index)">🧱</span>
            <span v-else-if="currentState === index">🤖</span>
          </div>

          <!-- Q-Values Overlay (Arrows/Colors) -->
          <div v-if="!walls.includes(index) && index !== goalState" class="q-overlay">
            <div 
              class="q-arrow q-up" 
              :style="{ opacity: getOpacity(index, 0) }"
              :title="`Up: ${getQ(index, 0).toFixed(1)}`"
            >▲</div>
            <div 
              class="q-arrow q-right" 
              :style="{ opacity: getOpacity(index, 1) }"
              :title="`Right: ${getQ(index, 1).toFixed(1)}`"
            >▶</div>
            <div 
              class="q-arrow q-down" 
              :style="{ opacity: getOpacity(index, 2) }"
              :title="`Down: ${getQ(index, 2).toFixed(1)}`"
            >▼</div>
            <div 
              class="q-arrow q-left" 
              :style="{ opacity: getOpacity(index, 3) }"
              :title="`Left: ${getQ(index, 3).toFixed(1)}`"
            >◀</div>
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
import { ref, computed, onUnmounted, reactive } from 'vue';

// Configuration
const rows = 4;
const cols = 5;
const startState = 0;
const goalState = 19; // Bottom right
const hazards = [5, 7, 12, 16]; // Fire pits
const walls = [6, 11]; // Walls

// Q-Learning Hyperparameters
const learningRate = 0.5;
const discountFactor = 0.9;
const minEpsilon = 0.05;

// State
const currentState = ref(startState);
const episode = ref(1);
const epsilon = ref(1.0); // Start with high exploration
const lastReward = ref(0);
const isRunning = ref(false);
const logs = ref<string[]>(['Q-Learning Agent initialized. Click Run to train.']);
let timer: number | null = null;

// Q-Table: Array of arrays [Rows*Cols][4 actions]
// Actions: 0: Up, 1: Right, 2: Down, 3: Left
const qTable = reactive<number[][]>(
  Array.from({ length: rows * cols }, () => [0, 0, 0, 0])
);

// Derived grid for rendering
const grid = computed(() => Array.from({ length: rows * cols }, (_, i) => i));

const getQ = (state: number, action: number) => qTable[state][action];

// Visualization helper: Opacity based on Q-value magnitude relative to row max
const getOpacity = (state: number, action: number) => {
  const qs = qTable[state];
  const min = Math.min(...qs);
  const max = Math.max(...qs);
  const val = qs[action];
  
  // If all zero, show faint
  if (min === max) return 0.2;
  
  // Normalize 0.2 to 1.0
  return 0.2 + (0.8 * (val - min) / ((max - min) || 1));
};

const reset = () => {
  currentState.value = startState;
  episode.value = 1;
  epsilon.value = 1.0;
  lastReward.value = 0;
  isRunning.value = false;
  if (timer) clearInterval(timer);
  
  // Reset Q-Table
  for (let s = 0; s < rows * cols; s++) {
    for (let a = 0; a < 4; a++) {
      qTable[s][a] = 0;
    }
  }
  logs.value = ['Training reset.'];
};

const step = () => {
  // 1. Choose Action (Epsilon-Greedy)
  let action: number;
  if (Math.random() < epsilon.value) {
    // Explore
    action = Math.floor(Math.random() * 4);
  } else {
    // Exploit: Choose action with max Q value
    const qs = qTable[currentState.value];
    // Find all indices with max value to break ties randomly
    const maxVal = Math.max(...qs);
    const bestActions = qs.map((v, i) => v === maxVal ? i : -1).filter(i => i !== -1);
    action = bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  // 2. Perform Action & Observe Reward/Next State
  const nextState = getNextState(currentState.value, action);
  let r = 0;
  let done = false;

  if (nextState === goalState) {
    r = 100;
    done = true;
    logs.value.unshift(`Episode ${episode.value} finished! Reward: 100 🏆`);
  } else if (hazards.includes(nextState)) {
    r = -100;
    done = true;
    logs.value.unshift(`Episode ${episode.value} failed. Reward: -100 🔥`);
  } else {
    r = -1; // Small penalty for each step to encourage shortest path
  }

  // 3. Update Q-Value
  // Q(s,a) = Q(s,a) + alpha * [r + gamma * max(Q(s', a')) - Q(s,a)]
  const oldQ = qTable[currentState.value][action];
  const maxNextQ = Math.max(...qTable[nextState]);
  const newQ = oldQ + learningRate * (r + discountFactor * maxNextQ - oldQ);
  qTable[currentState.value][action] = newQ;

  // 4. Transition
  // If we hit a wall/boundary (getNextState handles stay-in-place), we stay.
  // Assuming walls are not terminal but blocking.
  currentState.value = nextState;
  lastReward.value += r;

  // 5. Handle Episode End
  if (done) {
    currentState.value = startState;
    episode.value++;
    // Decay epsilon
    if (epsilon.value > minEpsilon) {
      epsilon.value *= 0.99;
    }
    lastReward.value = 0;
    
    // Trim logs
    if (logs.value.length > 5) logs.value.pop();
  }
};

const getNextState = (s: number, a: number) => {
  const r = Math.floor(s / cols);
  const c = s % cols;
  
  let nr = r, nc = c;
  
  if (a === 0) nr = Math.max(0, r - 1); // Up
  if (a === 1) nc = Math.min(cols - 1, c + 1); // Right
  if (a === 2) nr = Math.min(rows - 1, r + 1); // Down
  if (a === 3) nc = Math.max(0, c - 1); // Left
  
  const ns = nr * cols + nc;
  
  // Check walls
  if (walls.includes(ns)) return s; // Bounce back
  
  return ns;
};

const toggleRun = () => {
  if (isRunning.value) {
    isRunning.value = false;
    if (timer) clearInterval(timer);
  } else {
    isRunning.value = true;
    timer = window.setInterval(step, 50); // Fast steps
  }
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
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
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #2563eb;
}

.stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #475569;
}

.visualization-container {
  padding: 1.5rem;
  background: #f1f5f9;
  display: flex;
  justify-content: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 50px);
  grid-template-rows: repeat(var(--rows), 50px);
  gap: 4px;
}

.cell {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  user-select: none;
}

.cell.wall {
  background: #475569;
  border-color: #334155;
}

.cell.hazard {
  background: #fca5a5;
  border-color: #f87171;
}

.cell.goal {
  background: #86efac;
  border-color: #4ade80;
}

.agent {
  z-index: 10; /* On top of overlay */
}

/* Q-Overlay */
.q-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: grid;
  grid-template-areas: 
    ". u ."
    "l . r"
    ". d .";
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  pointer-events: none;
}

.q-arrow {
  font-size: 0.5rem;
  color: #3b82f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.q-up { grid-area: u; }
.q-down { grid-area: d; }
.q-left { grid-area: l; }
.q-right { grid-area: r; }

.console {
  background: #0f172a;
  color: #a5b4fc;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 100px;
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
</style>
