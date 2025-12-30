<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start DP Fib(6)' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="dp-array-container">
        <transition-group name="cell-pop">
           <div 
             v-for="(val, idx) in dp" 
             :key="idx"
             class="dp-cell"
             :class="{
               'computed': computedIndices.has(idx),
               'active': currentIndex === idx,
               'source': currentIndex !== null && (idx === currentIndex - 1 || idx === currentIndex - 2)
             }"
           >
              <span class="idx-label">i={{ idx }}</span>
              <span class="value">{{ val !== null ? val : '?' }}</span>
           </div>
        </transition-group>
      </div>
      
      <div class="formula-display" :class="{ visible: currentIndex !== null && currentIndex >= 2 }">
         <span v-if="currentIndex !== null && currentIndex >= 2">
           dp[{{ currentIndex }}] = dp[{{ currentIndex-1 }}] + dp[{{ currentIndex-2 }}] 
           <br>
           <strong>{{ (dp[currentIndex-1] || 0) + (dp[currentIndex-2] || 0) }}</strong> = {{ dp[currentIndex-1] }} + {{ dp[currentIndex-2] }}
         </span>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const N = 6;
const dp = ref<(number|null)[]>(new Array(N + 1).fill(null));
const computedIndices = ref<Set<number>>(new Set());
const currentIndex = ref<number | null>(null);

const logs = ref<string[]>(['Ready. Calculate Fibonacci(6) using DP (Memoization/Tabulation).']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);

let autoPlayInterval: number | null = null;
let step = 0; // 0: Init 0,1. 1..N-1: Fill rest.

const reset = () => {
    dp.value = new Array(N + 1).fill(null);
    computedIndices.value = new Set();
    currentIndex.value = null;
    logs.value = ['Ready. Calculate Fibonacci(6).'];
    isStarted.value = false;
    isFinished.value = false;
    step = 0;
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
        // Base cases
        dp.value[0] = 0;
        dp.value[1] = 1;
        computedIndices.value.add(0);
        computedIndices.value.add(1);
        logs.value.push('Base cases: dp[0]=0, dp[1]=1.');
        step = 2;
        return;
    }

    if (step <= N) {
        currentIndex.value = step;
        const val1 = dp.value[step-1]!;
        const val2 = dp.value[step-2]!;
        const result = val1 + val2;
        
        dp.value[step] = result;
        computedIndices.value.add(step);
        logs.value.push(`Computed dp[${step}] = dp[${step-1}] (${val1}) + dp[${step-2}] (${val2}) = ${result}.`);
        
        step++;
    } else {
        logs.value.push(`Finished! F(${N}) = ${dp.value[N]}.`);
        currentIndex.value = null;
        isFinished.value = true;
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
  background: #059669; /* Green */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #047857; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #059669;
  border: 1px solid #059669;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 1rem;
  background: #ecfdf5; /* Light green bg */
}

.dp-array-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.dp-cell {
  width: 60px;
  height: 80px;
  background: white;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.idx-label {
  position: absolute;
  top: 4px;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: bold;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #334155;
}

.dp-cell.computed {
  border-color: #10b981;
  background: #d1fae5;
  color: #065f46;
}

.dp-cell.active {
  transform: scale(1.15);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
  z-index: 10;
  border-color: #059669;
}

.dp-cell.source {
  border-color: #3b82f6; /* Blue for source operands */
  background: #dbeafe;
}

.formula-display {
  min-height: 3rem;
  text-align: center;
  font-family: monospace;
  font-size: 1.1rem;
  color: #065f46;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
}

.formula-display.visible {
  opacity: 1;
  transform: translateY(0);
}

.console {
  background: #0f172a;
  color: #6ee7b7;
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

.cell-pop-enter-active {
  transition: all 0.5s ease;
}
.cell-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
</style>
