<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
         <div class="label">Click to add:</div>
         <div class="btn-group">
            <button class="action-btn blue" :class="{ active: mode === 1 }" @click="mode = 1">
               🔵 Blue (+1)
            </button>
            <button class="action-btn orange" :class="{ active: mode === -1 }" @click="mode = -1">
               🟠 Orange (-1)
            </button>
         </div>
         <button @click="reset" class="reset-btn">Reset</button>
      </div>
      <div class="stats" v-if="weights">
         <div class="stat">Margin: {{ marginWidth.toFixed(2) }}</div>
      </div>
    </div>

    <div class="visualization-container">
       <div class="plot-area" @click="addPoint">
          <!-- Grid -->
          <div class="grid-bg"></div>

          <!-- Points -->
          <transition-group name="pop">
             <div 
                v-for="(p, i) in points" 
                :key="i" 
                class="data-point"
                :class="p.y === 1 ? 'blue' : 'orange'"
                :style="{ left: p.x + '%', top: (100 - p.yVis) + '%' }"
             >
                <!-- Support Vector Indicator -->
                <div class="sv-ring" v-if="isSupportVector(p)"></div>
             </div>
          </transition-group>

          <!-- Separator & Margins -->
          <svg class="svm-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
             <template v-if="points.length >= 2">
                <!-- Main Hyperplane (w.x + b = 0) -->
                <line 
                   :x1="coords.x1" :y1="coords.y1" 
                   :x2="coords.x2" :y2="coords.y2" 
                   stroke="#334155" stroke-width="0.5"
                />
                
                <!-- Margin Top (w.x + b = 1) -->
                <line 
                   :x1="marginCoords.top.x1" :y1="marginCoords.top.y1" 
                   :x2="marginCoords.top.x2" :y2="marginCoords.top.y2" 
                   stroke="#3b82f6" stroke-width="0.3" stroke-dasharray="2"
                   opacity="0.6"
                />
                
                <!-- Margin Bottom (w.x + b = -1) -->
                <line 
                   :x1="marginCoords.bot.x1" :y1="marginCoords.bot.y1" 
                   :x2="marginCoords.bot.x2" :y2="marginCoords.bot.y2" 
                   stroke="#f97316" stroke-width="0.3" stroke-dasharray="2"
                   opacity="0.6"
                />
             </template>
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

interface Point {
  x: number; // 0-100 vis
  yVis: number; // 0-100 vis (y axis)
  xNorm: number; // -1 to 1 math
  yNorm: number; // -1 to 1 math
  y: 1 | -1; // Class
}

const points = ref<Point[]>([]);
const mode = ref<1 | -1>(1);
const logs = ref<string[]>(['Ready. Add Blue (+) and Orange (-) points to separate them.']);

// Model: w is vector [w1, w2], b is bias
const weights = ref({ w1: 1, w2: 1, b: 0 });

const addPoint = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const xPct = ((e.clientX - rect.left) / rect.width) * 100;
  const yPct = ((e.clientY - rect.top) / rect.height) * 100;
  
  // Math coords: center is (0,0), range roughly -5 to 5 for training stability
  // But let's map 0-100% to -2 to 2?
  const xNorm = (xPct - 50) / 25;
  const yVis = 100 - yPct; // bottom is 0
  const yNorm = (yVis - 50) / 25;
  
  points.value.push({ 
     x: xPct, 
     yVis: yVis,
     xNorm, 
     yNorm,
     y: mode.value 
  });
  
  trainStep();
};

const trainStep = () => {
   // Simple Pegasos (Stochastic Gradient Descent for SVM)
   // Run many iterations instantly
   
   let w1 = weights.value.w1;
   let w2 = weights.value.w2;
   let b = weights.value.b;
   
   const lambda = 0.01; // reg parameter
   const eta = 0.01; // learning rate
   const iterations = 1000;
   
   if (points.value.length < 2) return;
   
   for (let i = 0; i < iterations; i++) {
      // Pick random point
      const p = points.value[Math.floor(Math.random() * points.value.length)];
      
      // Condition: y_i * (w . x + b) < 1
      const decision = p.y * (w1 * p.xNorm + w2 * p.yNorm + b);
      
      if (decision < 1) {
         w1 = (1 - eta * lambda) * w1 + eta * p.y * p.xNorm;
         w2 = (1 - eta * lambda) * w2 + eta * p.y * p.yNorm;
         b = b + eta * p.y;
      } else {
         w1 = (1 - eta * lambda) * w1;
         w2 = (1 - eta * lambda) * w2;
      }
   }
   
   weights.value = { w1, w2, b };
   
   logs.value.push(`Trained. w=[${w1.toFixed(2)}, ${w2.toFixed(2)}], b=${b.toFixed(2)}`);
};

// Helper to get Y coordinate (0-100) for a given X (0-100) on the line w.x + b = offset
const getLineY = (xPct: number, offset = 0) => {
   // xPct -> xNorm
   const xN = (xPct - 50) / 25;
   const { w1, w2, b } = weights.value;
   if (Math.abs(w2) < 0.001) return -100; // Vertical line handling omitted for simplicity
   
   // Formula: w1*x + w2*y + b = offset
   // w2*y = offset - b - w1*x
   // y = (offset - b - w1*x) / w2
   
   const yN = (offset - b - w1 * xN) / w2;
   
   // yNorm -> yPct
   return (yN * 25) + 50; 
};

// Main separating line (offset 0)
const coords = computed(() => {
   return {
      x1: 0, 
      y1: 100 - getLineY(0, 0),
      x2: 100, 
      y2: 100 - getLineY(100, 0)
   };
});

// Margins (offset 1 and -1)
const marginCoords = computed(() => {
   return {
      top: {
         x1: 0, y1: 100 - getLineY(0, 1),
         x2: 100, y2: 100 - getLineY(100, 1)
      },
      bot: {
         x1: 0, y1: 100 - getLineY(0, -1),
         x2: 100, y2: 100 - getLineY(100, -1)
      }
   };
});

const marginWidth = computed(() => {
   // Approx margin width = 2 / ||w||
   const { w1, w2 } = weights.value;
   const norm = Math.sqrt(w1*w1 + w2*w2);
   return norm === 0 ? 0 : 2 / norm;
});

const isSupportVector = (p: Point) => {
   // Points close to margin boundaries
   // decision = y * (w.x + b)
   const { w1, w2, b } = weights.value;
   const val = p.y * (w1 * p.xNorm + w2 * p.yNorm + b);
   // In hard margin SVM, SVs have val = 1. In soft margin, val <= 1.
   return val < 1.1; 
};

const reset = () => {
   points.value = [];
   weights.value = { w1: 0.1, w2: 0.1, b: 0 };
   logs.value = ['Cleared points.'];
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
  align-items: center;
  gap: 1rem;
}

.label { font-weight: bold; font-size: 0.8rem; color: #64748b; }

.btn-group { display: flex; gap: 0.5rem; }

.action-btn {
  border: 1px solid transparent;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background: white;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.action-btn.blue { color: #3b82f6; border-color: #bfdbfe; }
.action-btn.blue.active { background: #3b82f6; color: white; border-color: #2563eb; }

.action-btn.orange { color: #f97316; border-color: #fed7aa; }
.action-btn.orange.active { background: #f97316; color: white; border-color: #ea580c; }

.reset-btn {
  background: transparent; border: none;
  font-size: 0.8rem; text-decoration: underline; color: #94a3b8; cursor: pointer;
}

.stats {
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  color: #64748b;
}

.visualization-container {
  height: 350px;
  background: #f9fafb;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.plot-area {
  width: 100%;
  max-width: 400px;
  height: 100%;
  border: 1px solid #cbd5e1;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  background: white;
}

.grid-bg {
  width: 100%; height: 100%;
  background-image: linear-gradient(#f1f5f9 1px, transparent 1px),
                    linear-gradient(90deg, #f1f5f9 1px, transparent 1px);
  background-size: 20px 20px;
  position: absolute;
  pointer-events: none;
}

.data-point {
  width: 12px; height: 12px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 10;
}
.data-point.blue { background: #3b82f6; }
.data-point.orange { background: #f97316; }

.sv-ring {
  position: absolute;
  top: -4px; left: -4px;
  width: 16px; height: 16px;
  border: 1px dashed #64748b;
  border-radius: 50%;
  opacity: 0.6;
}

.svm-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.pop-enter-active { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.console {
  background: #0f172a;
  color: #e2e8f0;
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
