<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start KMP' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="string-area">
        <label class="label">Text (i = {{ i }})</label>
        <div class="string-box">
          <div 
            v-for="(char, idx) in text" 
            :key="'t'+idx"
            class="char-box"
            :class="{ 
              'match': isMatch(idx),
              'mismatch': isMismatch(idx),
              'current': idx === i
            }"
          >
            {{ char }}
            <div v-if="idx === i" class="pointer-arrow top">↓</div>
          </div>
        </div>
      </div>

      <div class="string-area">
        <label class="label">Pattern (j = {{ j }})</label>
        <!-- We shift the pattern visually by setting padding-left or transform based on (i - j) -->
        <div class="string-box pattern-container" :style="{ transform: `translateX(${getShiftOffset}px)` }">
          <div 
            v-for="(char, idx) in pattern" 
            :key="'p'+idx"
            class="char-box"
            :class="{ 
              'match': isMatch(i - j + idx) && idx <= j,
              'mismatch': idx === j && isMismatch(i),
              'current': idx === j
            }"
          >
            {{ char }}
            <div v-if="idx === j" class="pointer-arrow bottom">↑</div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <div class="label">LPM / Fail Table (π)</div>
         <div class="lpm-table">
            <div class="lpm-row header">
               <div class="lpm-cell" v-for="(char, idx) in pattern" :key="'h'+idx">{{ idx }}</div>
            </div>
            <div class="lpm-row char">
               <div class="lpm-cell" v-for="(char, idx) in pattern" :key="'c'+idx">{{ char }}</div>
            </div>
            <div class="lpm-row val">
               <div class="lpm-cell" 
                 v-for="(val, idx) in piTable" 
                 :key="'v'+idx"
                 :class="{ 'highlight': highlightPi === idx }"
               >{{ val }}</div>
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

const textStr = "ABABDABACDABABCABAB";
const patternStr = "ABABCABAB";

const text = ref(textStr.split(''));
const pattern = ref(patternStr.split(''));

// Compute π table upfront for visualization simplicity, though we could visualize building it too.
// For KMP matching logic:
const computePi = (P: string) => {
  const m = P.length;
  const pi = new Array(m).fill(0);
  let k = 0;
  for (let q = 1; q < m; q++) {
    while (k > 0 && P[k] !== P[q]) k = pi[k-1];
    if (P[k] === P[q]) k++;
    pi[q] = k;
  }
  return pi;
};

const piTable = ref(computePi(patternStr));

// State
const i = ref(0); // index in text
const j = ref(0); // index in pattern
const logs = ref<string[]>(['Ready. Pattern pre-processed into LPM table.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
// Visual helpers
const mismatchAt = ref<number | null>(null);
const matchAt = ref<Set<number>>(new Set());
const highlightPi = ref<number | null>(null);

let autoPlayInterval: number | null = null;
const charWidth = 32; // px approx width of char-box + gap

const getShiftOffset = computed(() => {
  // Shift pattern so that pattern[j] aligns with text[i]
  // Visually: The start of pattern (index 0) should be at text index (i - j).
  // So shift = (i - j) * charWidth
  return (i.value - j.value) * charWidth;
});

const isMatch = (textIdx: number) => {
    // Basic "green" if we have successfully compared p[0...k] with t[...textIdx]
    // Only highlight if it's part of the current comparison run
    // If textIdx is 'behind' i but was part of the prefix match
    if (textIdx < i.value && textIdx >= i.value - j.value) return true;
    return false;
};

const isMismatch = (textIdx: number) => {
    return mismatchAt.value === textIdx;
};

const reset = () => {
    i.value = 0;
    j.value = 0;
    logs.value = ['Ready.'];
    isStarted.value = false;
    isFinished.value = false;
    mismatchAt.value = null;
    highlightPi.value = null;
    matchAt.value = new Set();
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
    }, 1200) as unknown as number;
  }
};

const nextStep = () => {
    if (isFinished.value) return;
    
    mismatchAt.value = null;
    highlightPi.value = null;

    if (!isStarted.value) {
        isStarted.value = true;
    }

    if (i.value < text.value.length) {
        // Compare text[i] and pattern[j]
        const tChar = text.value[i.value];
        const pChar = pattern.value[j.value];
        
        logs.value.push(`Compare T[${i.value}]='${tChar}' with P[${j.value}]='${pChar}'...`);

        if (tChar === pChar) {
            logs.value.push('Match! Init pointers ++.');
            i.value++;
            j.value++;
            
            if (j.value === pattern.value.length) {
                logs.value.push(`Full match found ending at index ${i.value - 1}!`);
                logs.value.push(`Jumping j using table: j = pi[${j.value-1}] = ${piTable.value[j.value-1]}.`);
                highlightPi.value = j.value - 1;
                j.value = piTable.value[j.value - 1];
                // Continue searching? usually yes.
            }
        } else {
            logs.value.push('Mismatch!');
            mismatchAt.value = i.value; // Show red flash
            
            if (j.value !== 0) {
                const newJ = piTable.value[j.value - 1];
                highlightPi.value = j.value - 1;
                logs.value.push(`Mismatch after partial match. Jump j: ${j.value} -> pi[${j.value-1}] (${newJ}). i stays at ${i.value}.`);
                j.value = newJ;
            } else {
                logs.value.push(`Mismatch at j=0. Just increment i: ${i.value} -> ${i.value + 1}.`);
                i.value++;
            }
        }
    } else {
        logs.value.push('End of text reached.');
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
  background: #db2777; /* Pink */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #be185d; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #db2777;
  border: 1px solid #db2777;
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
  gap: 2rem;
  padding: 2rem 1rem;
  background: #fff1f2; /* Light pink bg */
  overflow-x: auto;
}

.string-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #9d174d;
  font-weight: 700;
}

.string-box {
  display: flex;
  gap: 2px; /* Gap between chars */
}

.pattern-container {
  transition: transform 0.3s ease;
}

.char-box {
  width: 30px;
  height: 30px;
  background: white;
  border: 1px solid #fda4af;
  border-radius: 4px;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-family: monospace;
  color: #881337;
  position: relative;
  flex-shrink: 0;
}

.char-box.match {
  background: #bbf7d0; /* Green */
  border-color: #22c55e;
  color: #14532d;
}

.char-box.mismatch {
  background: #fecaca; /* Red */
  border-color: #ef4444;
  color: #7f1d1d;
  animation: shake 0.4s;
}

.char-box.current {
  border: 2px solid #db2777;
  z-index: 10;
}

.pointer-arrow {
  position: absolute;
  color: #db2777;
  font-size: 1.2rem;
  font-weight: 900;
  left: 50%;
  transform: translateX(-50%);
}

.pointer-arrow.top { top: -24px; }
.pointer-arrow.bottom { bottom: -24px; }

.table-area {
  margin-top: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fecdd3;
  width: fit-content;
}

.lpm-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.lpm-row {
  display: flex;
}

.lpm-row.header { background: #f1f5f9; color: #64748b; font-size: 0.7rem; }
.lpm-row.char { background: #fff; font-weight: bold; color: #334155; }
.lpm-row.val { background: #fff; color: #db2777; font-family: monospace; }

.lpm-cell {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.lpm-cell.highlight {
  background: #fce7f3;
  font-weight: 900;
}

.console {
  background: #0f172a;
  color: #f472b6;
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

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
