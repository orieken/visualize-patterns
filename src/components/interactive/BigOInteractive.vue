<template>
  <div class="big-o-viz">
    <div class="controls">
      <div class="control-group">
        <label>Constant C: {{ c }}</label>
        <input type="range" v-model.number="c" min="1" max="10" step="0.5" />
      </div>
      <div class="control-group">
        <label>Threshold k: {{ k }}</label>
        <input type="range" v-model.number="k" min="0" max="20" step="1" />
      </div>
    </div>

    <!-- SVG Graph -->
    <svg class="chart" viewBox="0 0 300 150">
      <!-- Axes -->
      <line x1="20" y1="130" x2="290" y2="130" stroke="#94a3b8" />
      <line x1="20" y1="130" x2="20" y2="10" stroke="#94a3b8" />

      <!-- F(n): 2n + 5 -->
      <path :d="fPath" fill="none" stroke="#2563eb" stroke-width="2" />
      <text x="50" y="20" fill="#2563eb" font-size="10">f(n) = 2n + 5</text>

      <!-- G(n): C * n -->
      <path :d="gPath" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="4" />
      <text x="200" y="20" fill="#dc2626" font-size="10">C*g(n) = {{c}}*n</text>

      <!-- K line -->
      <line 
        :x1="xScale(k)" y1="130" 
        :x2="xScale(k)" y2="10" 
        stroke="#10b981" stroke-width="1" stroke-dasharray="2" 
      />
      <text :x="xScale(k) + 2" y="145" fill="#10b981" font-size="10">k={{k}}</text>
    </svg>

    <div class="status" :class="{ valid: isValid }">
      {{ isValid ? '✅ PROVEN: C*g(n) ≥ f(n) for n > k' : '❌ INVALID: f(n) escapes C*g(n)' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const c = ref(3);
const k = ref(5);

const MAX_X = 25;
const MAX_Y = 80;

const xScale = (n: number) => 20 + (n / MAX_X) * 270;
const yScale = (val: number) => 130 - (val / MAX_Y) * 120;

const f = (n: number) => 2 * n + 5;
const g = (n: number) => c.value * n;

const generatePath = (func: (n: number) => number) => {
  let path = `M ${xScale(0)} ${yScale(func(0))}`;
  for (let n = 1; n <= MAX_X; n++) {
    path += ` L ${xScale(n)} ${yScale(func(n))}`;
  }
  return path;
};

const fPath = computed(() => generatePath(f));
const gPath = computed(() => generatePath(g));

const isValid = computed(() => {
    // Check points after k up to MAX_X
    for(let n = k.value + 1; n <= MAX_X; n++) {
        if (f(n) > g(n)) return false;
    }
    return true;
});
</script>

<style scoped>
.big-o-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    display: flex;
    gap: 1rem;
    background: rgba(255,255,255,0.5);
    padding: 0.5rem;
    border-radius: 8px;
}
.control-group {
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
}
.chart {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.status {
    text-align: center;
    font-weight: bold;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-radius: 4px;
    background: #fee2e2;
    color: #b91c1c;
}
.status.valid {
    background: #dcfce7;
    color: #15803d;
}
</style>
