<template>
  <div class="gd-viz">
    <div class="controls">
       <button @click="reset" class="btn">Reset</button>
       <button @click="step" class="btn primary" :disabled="done">Step</button>
       <div class="param">
           <label>Learning Rate: {{ lr }}</label>
           <input type="range" v-model.number="lr" min="0.05" max="0.5" step="0.05" />
       </div>
    </div>
    
    <svg class="chart" viewBox="0 0 300 200">
        <!-- Curve y = x^2/5 (scaled) -->
        <path :d="curvePath" fill="none" stroke="#94a3b8" stroke-width="2" />
        
        <!-- Target Minimum -->
        <circle cx="150" cy="180" r="4" fill="#10b981" />
        
        <!-- Current Ball -->
        <circle 
            :cx="ballX" 
            :cy="ballY" 
            r="8" 
            fill="#2563eb" 
            class="ball" 
        />
        
        <!-- Gradient Vector Arrow -->
        <line 
          :x1="ballX" :y1="ballY" 
          :x2="arrowEnd" :y2="ballY + (ballX < 150 ? 20 : -20)" 
          stroke="#ef4444" 
          stroke-width="2" 
          marker-end="url(#arrowhead)"
        />
    </svg>
    
    <div class="info">
        Iteration: {{ iter }} | X: {{ currentX.toFixed(2) }} | Grad: {{ (2*currentX).toFixed(2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const lr = ref(0.1);
const iter = ref(0);
const currentX = ref(10.0); // Abstract X, target is 0

// Visualization Mapping
// X range: -12 to 12 -> 0 to 300 svg pixels
// Y range: 0 to 144 -> 180 to 20 svg pixels (inverted)
const mapX = (x: number) => 150 + x * 12; // Center at 150
const mapY = (y: number) => 180 - (y/1.5); 

// y = x^2
const f = (x: number) => x * x;

const curvePath = computed(() => {
    let d = `M ${mapX(-12)} ${mapY(f(-12))}`;
    for(let i = -11; i <= 12; i+=0.5) {
        d += ` L ${mapX(i)} ${mapY(f(i))}`;
    }
    return d;
});

const ballX = computed(() => mapX(currentX.value));
const ballY = computed(() => mapY(f(currentX.value)));
const done = computed(() => Math.abs(currentX.value) < 0.1);

// Gradient points downhill
// If x > 0 (right side), slope is positive, we want to go left (x decreases)
const arrowEnd = computed(() => {
    const grad = 2 * currentX.value;
    const direction = grad > 0 ? -1 : 1; 
    return ballX.value + (direction * 30); // 30px arrow length
});

const step = () => {
    const grad = 2 * currentX.value;
    currentX.value = currentX.value - lr.value * grad;
    iter.value++;
};

const reset = () => {
    currentX.value = 10;
    iter.value = 0;
};
</script>

<style scoped>
.gd-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}
.controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}
.btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
}
.btn.primary {
    background: #2563eb;
    color: white;
    border: none;
}
.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.chart {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    width: 300px;
    height: 200px;
}
.ball {
    transition: all 0.3s ease-out;
}
.info {
    font-family: monospace;
    font-size: 0.9rem;
    color: #475569;
}
</style>
