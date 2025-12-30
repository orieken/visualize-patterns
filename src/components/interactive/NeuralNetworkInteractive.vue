<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Input (x1, x2):</label>
        <div class="sliders">
           <div class="slider-row">
              <span>X1: {{ x1.toFixed(2) }}</span>
              <input type="range" v-model.number="x1" min="0" max="1" step="0.01">
           </div>
           <div class="slider-row">
              <span>X2: {{ x2.toFixed(2) }}</span>
              <input type="range" v-model.number="x2" min="0" max="1" step="0.01">
           </div>
        </div>
      </div>
      <div class="task-info">
         Task: <strong>XOR Logic</strong>
         <div class="mini-truth-table">
            <div :class="{active: x1<0.5 && x2<0.5}">0,0➜0</div>
            <div :class="{active: x1>0.5 && x2<0.5}">1,0➜1</div>
            <div :class="{active: x1<0.5 && x2>0.5}">0,1➜1</div>
            <div :class="{active: x1>0.5 && x2>0.5}">1,1➜0</div>
         </div>
      </div>
    </div>

    <div class="visualization-container">
       <div class="network-svg-container">
          <svg class="network-svg" viewBox="0 0 400 200">
             <!-- Connections Input -> Hidden -->
             <!-- W_h1_x1 --><line :x1="pos.x1.x" :y1="pos.x1.y" :x2="pos.h1.x" :y2="pos.h1.y" :stroke-width="width(weights.h1_x1)" :stroke="color(activations.x1 * weights.h1_x1)" />
             <!-- W_h1_x2 --><line :x1="pos.x2.x" :y1="pos.x2.y" :x2="pos.h1.x" :y2="pos.h1.y" :stroke-width="width(weights.h1_x2)" :stroke="color(activations.x2 * weights.h1_x2)" />
             <!-- W_h2_x1 --><line :x1="pos.x1.x" :y1="pos.x1.y" :x2="pos.h2.x" :y2="pos.h2.y" :stroke-width="width(weights.h2_x1)" :stroke="color(activations.x1 * weights.h2_x1)" />
             <!-- W_h2_x2 --><line :x1="pos.x2.x" :y1="pos.x2.y" :x2="pos.h2.x" :y2="pos.h2.y" :stroke-width="width(weights.h2_x2)" :stroke="color(activations.x2 * weights.h2_x2)" />
             
             <!-- Connections Hidden -> Output -->
             <!-- W_out_h1 --><line :x1="pos.h1.x" :y1="pos.h1.y" :x2="pos.out.x" :y2="pos.out.y" :stroke-width="width(weights.out_h1)" :stroke="color(activations.h1 * weights.out_h1)" />
             <!-- W_out_h2 --><line :x1="pos.h2.x" :y1="pos.h2.y" :x2="pos.out.x" :y2="pos.out.y" :stroke-width="width(weights.out_h2)" :stroke="color(activations.h2 * weights.out_h2)" />

             <!-- Nodes -->
             <!-- Inputs -->
             <g :transform="`translate(${pos.x1.x}, ${pos.x1.y})`">
                <circle r="15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                <circle r="12" fill="#3b82f6" :opacity="activations.x1 * 0.9" />
                <text y="5" text-anchor="middle" font-size="10" fill="#1e293b" font-weight="bold">x1</text>
             </g>
             <g :transform="`translate(${pos.x2.x}, ${pos.x2.y})`">
                <circle r="15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                <circle r="12" fill="#3b82f6" :opacity="activations.x2 * 0.9" />
                <text y="5" text-anchor="middle" font-size="10" fill="#1e293b" font-weight="bold">x2</text>
             </g>

             <!-- Hidden -->
             <g :transform="`translate(${pos.h1.x}, ${pos.h1.y})`">
                <circle r="15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                <circle r="12" fill="#a855f7" :opacity="activations.h1 * 0.9" />
                <text y="30" text-anchor="middle" font-size="9" fill="#64748b">h1 (OR)</text>
             </g>
             <g :transform="`translate(${pos.h2.x}, ${pos.h2.y})`">
                <circle r="15" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                <circle r="12" fill="#a855f7" :opacity="activations.h2 * 0.9" />
                <text y="30" text-anchor="middle" font-size="9" fill="#64748b">h2 (NAND)</text>
             </g>

             <!-- Output -->
             <g :transform="`translate(${pos.out.x}, ${pos.out.y})`">
                <circle r="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
                <circle r="16" fill="#22c55e" :opacity="activations.out * 0.9" />
                <text y="5" text-anchor="middle" font-size="10" fill="#1e293b" font-weight="bold">{{ activations.out.toFixed(2) }}</text>
                <text y="35" text-anchor="middle" font-size="10" fill="#1e293b" font-weight="bold">Output (AND)</text>
             </g>
          </svg>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const x1 = ref(0);
const x2 = ref(0);

// Simple MLP weights to solve XOR
// Structure: 
// Inputs: x1, x2
// Hidden 1 (Acts like OR): weights [20, 20], bias -10  => Sigmoid
// Hidden 2 (Acts like NAND): weights [-20, -20], bias 30 => Sigmoid
// Output (Acts like AND): weights [20, 20], bias -30 => Sigmoid

const weights = {
   h1_x1: 20, h1_x2: 20, h1_b: -10,
   h2_x1: -20, h2_x2: -20, h2_b: 30,
   out_h1: 20, out_h2: 20, out_b: -30
};

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const activations = computed(() => {
   const val_x1 = x1.value;
   const val_x2 = x2.value;

   // Hidden 1
   const z1 = val_x1 * weights.h1_x1 + val_x2 * weights.h1_x2 + weights.h1_b;
   const h1 = sigmoid(z1);

   // Hidden 2
   const z2 = val_x1 * weights.h2_x1 + val_x2 * weights.h2_x2 + weights.h2_b;
   const h2 = sigmoid(z2);

   // Output
   const zOut = h1 * weights.out_h1 + h2 * weights.out_h2 + weights.out_b;
   const out = sigmoid(zOut);

   return { x1: val_x1, x2: val_x2, h1, h2, out };
});

const checkResult = () => {
    const t1 = x1.value > 0.5 ? 1 : 0;
    const t2 = x2.value > 0.5 ? 1 : 0;
    const target = t1 ^ t2; // XOR
    const pred = activations.value.out > 0.5 ? 1 : 0;
    
    return `Input [${t1}, ${t2}] Target: ${target}. Prediction: ${activations.value.out.toFixed(2)}`;
};

const logs = ref<string[]>([checkResult()]);

watch([x1, x2], () => {
   // Debounce log slightly or just show last
   // logs.value.push(checkResult()); 
   // Keep log cleaner
   const msg = checkResult();
   if (logs.value[logs.value.length-1] !== msg) {
      if (logs.value.length > 3) logs.value.shift();
      logs.value.push(msg);
   }
});

// Layout Positions
const pos = {
   x1: { x: 50, y: 50 },
   x2: { x: 50, y: 150 },
   h1: { x: 200, y: 50 },
   h2: { x: 200, y: 150 },
   out: { x: 350, y: 100 }
};

// Visual helpers
const width = (w: number) => Math.min(Math.abs(w) / 4, 5); // scale width
const color = (flow: number) => {
   // Flow is activation * weight. Can be positive or negative.
   // But sigmoid is always positive. 
   // So flow is negative if weight is negative.
   if (flow > 0.1) return '#22c55e'; // Excitatory
   if (flow < -0.1) return '#ef4444'; // Inhibitory
   return '#cbd5e1'; // Neutral
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
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.label { font-weight: bold; font-size: 0.8rem; color: #64748b; }

.sliders {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-family: 'Fira Code', monospace;
  color: #334155;
}

.task-info {
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mini-truth-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin-top: 4px;
  font-size: 0.65rem;
  font-family: 'Fira Code', monospace;
}
.mini-truth-table div {
  background: #e2e8f0;
  padding: 1px 4px;
  border-radius: 2px;
  opacity: 0.5;
}
.mini-truth-table div.active {
  background: #3b82f6;
  color: white;
  opacity: 1;
  font-weight: bold;
}

.visualization-container {
  height: 250px;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.network-svg-container {
  width: 100%;
  height: 100%;
  max-width: 500px;
}

.network-svg {
  width: 100%;
  height: 100%;
}

.console {
  background: #0f172a;
  color: #a5b4fc;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 80px;
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
