<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
         <div class="label">Click to add data:</div>
         <div class="btn-group">
            <button class="action-btn pass" :class="{ active: mode === 1 }" @click="mode = 1">
               ✅ Pass (1)
            </button>
            <button class="action-btn fail" :class="{ active: mode === 0 }" @click="mode = 0">
               ❌ Fail (0)
            </button>
         </div>
         <button @click="reset" class="reset-btn">Reset</button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="chart-area" @click="addPoint">
          <!-- Background Grid -->
          <div class="grid-lines">
             <div class="axis y-axis">
                <span>1.0</span>
                <span>0.5</span>
                <span>0.0</span>
             </div>
             <div class="axis x-axis">
                <span>Hours Studied --></span>
             </div>
          </div>

          <!-- Points -->
          <transition-group name="pop">
            <div 
               v-for="(p, i) in points" 
               :key="i" 
               class="data-point"
               :class="p.y === 1 ? 'pass' : 'fail'"
               :style="{ left: p.x + '%', top: (100 - p.y * 100) + '%' }"
            ></div>
          </transition-group>

          <!-- Sigmoid Curve -->
          <svg class="sigmoid-svg" viewBox="0 0 100 100" preserveAspectRatio="none" v-if="points.length > 2">
             <path :d="sigmoidPath" fill="none" stroke="#6366f1" stroke-width="2" />
             <!-- Threshold Line -->
             <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" stroke-dasharray="4" stroke-width="1" />
          </svg>

          <!-- Hover Hint (Simulated probability for cursor X) -->
          <div 
             class="cursor-tracker" 
             v-if="points.length > 2 && mouseX > 0"
             :style="{ left: mouseX + '%'}"
             @mousemove="updateMouseX"
           >
              <div 
                class="prob-tooltip" 
                :style="{ bottom: (predict(mouseX) * 100) + '%' }"
              >
                  {{ (predict(mouseX) * 100).toFixed(0) }}%
              </div>
              <div 
                class="prob-dot"
                :style="{ bottom: (predict(mouseX) * 100) + '%' }"
              ></div>
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

interface Point {
  x: number; // 0-100%
  y: number; // 0 or 1
}

const points = ref<Point[]>([]);
const mode = ref<0 | 1>(1); // Currently adding classification
const logs = ref<string[]>(['Ready. Add "Pass" or "Fail" examples based on hours studied.']);

// Simple Logistic Regression Parameters (approximated for demo)
// z = b0 + b1 * x
// p = 1 / (1 + e^-z)
const b0 = ref(0);
const b1 = ref(0);
const loss = ref(0);

const mouseX = ref(0); // For tooltip

const addPoint = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  
  // y is strictly 0 or 1 based on mode
  const y = mode.value;

  points.value.push({ x, y });
  fitModel();
};

const fitModel = () => {
   // Extremely basic Gradient Descent for visualization purposes
   // In a real app, use a proper library or more iterations
   let w0 = 0; // Bias (Intercept)
   let w1 = 0; // Weight (Slope)
   const learningRate = 0.05; // Tuned for this scale (0-100)
   
   // Normalize X to 0-1 range for stable training, then map back? 
   // Actually let's just use raw but small weights init
   // Or better: Normalize x to range [-1, 1] relative to center
   const xMean = 50;
   const xStd = 50;

   // Train for N epochs
   for (let epoch = 0; epoch < 2000; epoch++) { // fast enough for <50 points
      let gradient0 = 0;
      let gradient1 = 0;
      
      for (const p of points.value) {
         const xNorm = (p.x - xMean) / xStd;
         const z = w0 + w1 * xNorm;
         const pred = 1 / (1 + Math.exp(-z));
         
         const error = pred - p.y;
         gradient0 += error;
         gradient1 += error * xNorm;
      }
      
      w0 -= learningRate * gradient0 / points.value.length;
      w1 -= learningRate * gradient1 / points.value.length;
   }
   
   // Store normalized weights? 
   // To keep getY simple, let's keep standardized equation:
   b0.value = w0;
   b1.value = w1;
   
   logs.value.push(`Model updated. Points: ${points.value.length}`);
};

const predict = (xRaw: number) => {
   const xNorm = (xRaw - 50) / 50;
   const z = b0.value + b1.value * xNorm;
   return 1 / (1 + Math.exp(-z));
};

const sigmoidPath = computed(() => {
   // Generate SVG path M x y L x y ...
   let d = `M 0 ${100 - predict(0) * 100}`;
   for (let i = 1; i <= 100; i += 2) {
      const y = predict(i);
      d += ` L ${i} ${100 - y * 100}`;
   }
   return d;
});


const updateMouseX = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  if (!el.parentElement) return;
  const rect = el.parentElement.getBoundingClientRect();
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100;
};

const reset = () => {
  points.value = [];
  b0.value = 0;
  b1.value = 0;
  logs.value = ['Cleared data.'];
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
  justify-content: center;
  align-items: center;
}

.panel {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.label {
  font-weight: bold;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  border: 2px solid transparent;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.action-btn.pass { color: #10b981; border-color: #d1fae5; }
.action-btn.pass.active { background: #10b981; color: white; border-color: #059669; }

.action-btn.fail { color: #ef4444; border-color: #fee2e2; }
.action-btn.fail.active { background: #ef4444; color: white; border-color: #b91c1c; }

.reset-btn {
  background: transparent;
  color: #94a3b8;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
}

.visualization-container {
  height: 300px;
  background: #fdfdfd;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
}

.chart-area {
  width: 100%;
  height: 100%;
  border-left: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  position: relative;
  cursor: pointer;
}

.grid-lines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}

.axis {
  position: absolute;
  font-size: 0.6rem;
  color: #94a3b8;
  display: flex;
}

.y-axis {
  left: -25px;
  top: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
}

.x-axis {
  bottom: -20px;
  left: 0;
  right: 0;
  justify-content: center;
}

.data-point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.data-point.pass { background: #10b981; }
.data-point.fail { background: #ef4444; }

.sigmoid-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
}

.cursor-tracker {
  position: absolute;
  top: 0; bottom: 0;
  pointer-events: none; /* Just visualized, managed by parent move */
  width: 1px;
}

.prob-tooltip {
  position: absolute;
  left: 10px;
  background: #1e1b4b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.prob-dot {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  position: absolute;
  left: -4px;
  transform: translateY(50%);
  box-shadow: 0 0 0 2px white;
}

.pop-enter-active { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

@keyframes pop-in {
  from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

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
