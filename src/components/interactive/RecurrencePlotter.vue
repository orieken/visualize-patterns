<template>
  <div class="recurrence-plotter">
    <div class="controls">
       <div class="formula">
          a<sub>n</sub> = 
          <input type="number" v-model.number="c1" class="coeff" /> a<sub>n-1</sub> + 
          <input type="number" v-model.number="c2" class="coeff" /> a<sub>n-2</sub>
       </div>
       <div class="initial">
          a<sub>0</sub>=<input type="number" v-model.number="a0" class="init-val" />, 
          a<sub>1</sub>=<input type="number" v-model.number="a1" class="init-val" />
       </div>
    </div>

    <!-- Simple Bar Chart -->
    <div class="chart-container">
        <div class="bars">
            <div 
                v-for="(val, i) in sequence" 
                :key="i"
                class="bar-wrapper"
            >
                <div class="bar" :style="{ height: getBarHeight(val) + '%' }"></div>
                <div class="label">{{ i }}</div>
                <div class="val" title="Value">{{ val }}</div>
            </div>
        </div>
    </div>
    
    <div class="sequence-list">
        {{ sequence.join(', ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const c1 = ref(1);
const c2 = ref(1);
const a0 = ref(0);
const a1 = ref(1);
const terms = 15;

const sequence = computed(() => {
    const seq = [a0.value, a1.value];
    for(let i=2; i<terms; i++) {
        const next = c1.value * seq[i-1] + c2.value * seq[i-2];
        seq.push(next);
    }
    return seq;
});

const maxVal = computed(() => Math.max(...sequence.value, 1));
const getBarHeight = (val: number) => {
    // Only plot positive magnitude for bar length, handle negative maybe later?
    // Let's coerce to min 5% for visibility
    const pct = (Math.abs(val) / Math.abs(maxVal.value)) * 90;
    return Math.max(pct, 2);
};
</script>

<style scoped>
.recurrence-plotter {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    background: #f1f5f9;
    padding: 0.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
}
.formula {
    font-size: 1.1rem;
    font-family: serif;
    font-style: italic;
}
.coeff { width: 40px; padding: 2px; text-align: center; }
.init-val { width: 40px; padding: 2px; text-align: center; }

.chart-container {
    height: 150px;
    border-bottom: 2px solid #94a3b8;
    background: #fff;
    padding-top: 20px;
}
.bars {
    display: flex;
    height: 100%;
    align-items: flex-end;
    gap: 4px;
}
.bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100%;
    justify-content: flex-end;
}
.bar {
    width: 80%;
    background: #3b82f6;
    border-radius: 2px 2px 0 0;
    transition: height 0.3s;
}
.label {
    font-size: 0.6rem;
    color: #64748b;
    margin-top: 2px;
}
.val {
    position: absolute;
    top: -20px; /* Does not track with bar top easily in css flex, hidden for now unless hover or rework */
    font-size: 0.6rem;
    display: none; 
}
.bar:hover { background: #2563eb; }

.sequence-list {
    font-family: monospace;
    font-size: 0.8rem;
    color: #475569;
    word-break: break-all;
    background: #f8fafc;
    padding: 0.5rem;
    border-radius: 4px;
}
</style>
