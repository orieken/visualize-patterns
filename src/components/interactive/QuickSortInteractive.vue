<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start Quick Sort' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="bars-container">
        <transition-group name="list-complete">
          <div 
            v-for="(val, idx) in array" 
            :key="val.id"
            class="bar-wrapper"
            :style="{ height: `${(val.value / 100) * 100}%` }"
          >
            <div 
              class="bar"
              :class="{
                'pivot': idx === pivotIdx,
                'comparing': idx === leftIdx || idx === rightIdx,
                'sorted': val.sorted,
                'inactive': pivotIdx !== null && (idx < range.start || idx > range.end)
              }"
            >
              <span class="bar-val">{{ val.value }}</span>
            </div>
            <div v-if="idx === pivotIdx" class="pointer-label pivot">P</div>
            <div v-if="idx === leftIdx" class="pointer-label left">L</div>
            <div v-if="idx === rightIdx" class="pointer-label right">R</div>
          </div>
        </transition-group>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ArrayItem {
  id: number;
  value: number;
  sorted: boolean;
}

interface PartitionRange {
  start: number;
  end: number;
}

// Initial Data
const initialValues = [65, 25, 80, 40, 55, 15, 70];
const createArray = () => initialValues.map((v, i) => ({ id: i, value: v, sorted: false }));

const array = ref<ArrayItem[]>(createArray());
const logs = ref<string[]>(['Ready. Quick Sort (Lomuto Partition).']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
let autoPlayInterval: number | null = null;

// Algorithm State
// We need a stack to simulate recursion iteratively for step-by-step control
const stack = ref<PartitionRange[]>([]);
const range = ref<PartitionRange>({ start: 0, end: initialValues.length - 1 });

// Partition State
const pivotIdx = ref<number | null>(null);
const leftIdx = ref<number | null>(null); // 'i' in Lomuto
const rightIdx = ref<number | null>(null); // 'j' (scanner) in Lomuto

type Phase = 'PICK_PIVOT' | 'SCAN' | 'SWAP' | 'PIVOT_PLACE' | 'NEXT_RANGE';
let phase: Phase = 'PICK_PIVOT';

const reset = () => {
  array.value = createArray();
  stack.value = [];
  range.value = { start: 0, end: initialValues.length - 1 };
  pivotIdx.value = null;
  leftIdx.value = null;
  rightIdx.value = null;
  logs.value = ['Ready. Quick Sort (Lomuto Partition).'];
  isStarted.value = false;
  isFinished.value = false;
  phase = 'PICK_PIVOT';
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
    }, 1000) as unknown as number;
  }
};

const swap = (i: number, j: number) => {
  const temp = array.value[i];
  array.value[i] = array.value[j];
  array.value[j] = temp;
};

const nextStep = () => {
  if (isFinished.value) return;

  if (!isStarted.value) {
    isStarted.value = true;
    stack.value.push({ start: 0, end: array.value.length - 1 });
    logs.value.push('Started. Range [0, n-1] pushed to stack.');
    return;
  }

  // If we are looking for a new range
  if (phase === 'NEXT_RANGE' || pivotIdx.value === null) {
    if (stack.value.length === 0) {
      logs.value.push('Stack empty. Sort Complete.');
      isFinished.value = true;
      pivotIdx.value = null;
      leftIdx.value = null;
      rightIdx.value = null;
      // Mark all sorted just in case
      array.value.forEach(x => x.sorted = true);
      return;
    }

    const nextRange = stack.value.pop()!;
    range.value = nextRange;

    // Base case: 0 or 1 element
    if (nextRange.start >= nextRange.end) {
      if (nextRange.start >= 0 && nextRange.start < array.value.length) {
        array.value[nextRange.start].sorted = true;
        logs.value.push(`Range [${nextRange.start}, ${nextRange.end}] size <= 1. Marked sorted.`);
      }
      return; // Already done, next loop will pop again
    }

    phase = 'PICK_PIVOT';
    logs.value.push(`Processing Range [${nextRange.start}, ${nextRange.end}].`);
    return;
  }

  // Lomuto Partitioning
  // Pivot is usually last element
  if (phase === 'PICK_PIVOT') {
    pivotIdx.value = range.value.end;
    leftIdx.value = range.value.start - 1; // i
    rightIdx.value = range.value.start; // j
    phase = 'SCAN';
    logs.value.push(`Pivot chosen: ${array.value[pivotIdx.value].value} (index ${pivotIdx.value}). Initialized pointers.`);
    return;
  }

  if (phase === 'SCAN') {
    // Check if j reached pivot
    if (rightIdx.value! >= range.value.end) {
      phase = 'PIVOT_PLACE';
      return;
    }

    // Compare A[j] with Pivot
    const valJ = array.value[rightIdx.value!].value;
    const valPivot = array.value[pivotIdx.value!].value;

    if (valJ < valPivot) {
      logs.value.push(`${valJ} < Pivot (${valPivot}). Increment Left (L) & preparing swap.`);
      leftIdx.value!++;
      phase = 'SWAP';
    } else {
      logs.value.push(`${valJ} >= Pivot (${valPivot}). Just advance Right (R).`);
      rightIdx.value!++;
       // Stay in SCAN
    }
    return;
  }

  if (phase === 'SWAP') {
    // Swap A[i] and A[j]
    if (leftIdx.value !== rightIdx.value) {
      swap(leftIdx.value!, rightIdx.value!);
      logs.value.push(`Swapped ${array.value[rightIdx.value!].value} and ${array.value[leftIdx.value!].value}.`);
    } else {
      logs.value.push(`L and R at same index, no effective swap.`);
    }
    rightIdx.value!++;
    phase = 'SCAN';
    return;
  }

  if (phase === 'PIVOT_PLACE') {
    // Swap A[i+1] with A[end] (Pivot)
    const finalPivotIdx = leftIdx.value! + 1;
    swap(finalPivotIdx, range.value.end);
    
    array.value[finalPivotIdx].sorted = true; // Pivot is now in final place
    logs.value.push(`Moved Pivot to final position ${finalPivotIdx}. Sorted.`);
    
    // Push new ranges
    // Left side: [start, p-1]
    if (finalPivotIdx - 1 >= range.value.start) {
      stack.value.push({ start: range.value.start, end: finalPivotIdx - 1 });
    } else if (finalPivotIdx - 1 >= 0) {
      // Mark single item sorted if skipped
      // array.value[finalPivotIdx - 1].sorted = true; // logic implicitly handles via base case usually
    }

    // Right side: [p+1, end]
    if (finalPivotIdx + 1 <= range.value.end) {
      stack.value.push({ start: finalPivotIdx + 1, end: range.value.end });
    }

    // Visual cleanup
    pivotIdx.value = null;
    leftIdx.value = null;
    rightIdx.value = null;
    phase = 'NEXT_RANGE';
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
  background: #f97316;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #ea580c; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #f97316;
  border: 1px solid #f97316;
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
  justify-content: center;
  align-items: flex-end;
  padding: 1rem 2rem;
  height: 250px;
  background: #fff7ed; /* Light orange bg */
}

.bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.5s ease;
}

.bar {
  width: 100%;
  height: 100%;
  background: #fb923c;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  transition: all 0.3s;
}

.bar-val {
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
}

.bar.pivot {
  background: #db2777; /* Pink */
}

.bar.comparing {
  background: #3b82f6; /* Blue for pointers */
}

.bar.sorted {
  background: #22c55e; /* Green */
  opacity: 1 !important;
}

.bar.inactive {
  opacity: 0.3;
}

.pointer-label {
  position: absolute;
  bottom: -25px;
  font-size: 0.8rem;
  font-weight: 900;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.pointer-label.pivot { color: #db2777; bottom: -45px; } /* Stagger labels if needed */
.pointer-label.left { color: #3b82f6; }
.pointer-label.right { color: #3b82f6; bottom: -45px; } 

/* Handle collision of labels roughly by staggering R and P */

.console {
  background: #0f172a;
  color: #fdba74;
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

.list-complete-move {
  transition: transform 0.5s ease;
}
</style>
