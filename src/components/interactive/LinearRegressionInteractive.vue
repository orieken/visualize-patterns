<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <div class="stats">
           <div class="stat-item">
              <span class="label">Equation:</span>
              <span class="value math">{{ equationString }}</span>
           </div>
           <div class="stat-item">
              <span class="label">m (Slope):</span>
              <span class="value">{{ m.toFixed(2) }}</span>
           </div>
           <div class="stat-item">
              <span class="label">b (Intercept):</span>
              <span class="value">{{ b.toFixed(2) }}</span>
           </div>
        </div>
      </div>
      <button @click="reset" class="action-btn">
         Clear Points
      </button>
    </div>

    <div class="visualization-container">
       <div class="canvas-wrapper" @click="addPoint" ref="canvasRef">
          <!-- Grid -->
          <div class="grid-lines"></div>
          
          <!-- Points -->
          <div 
             v-for="(p, i) in points" 
             :key="i" 
             class="data-point"
             :style="{ left: p.x + '%', bottom: p.y + '%' }"
          ></div>

          <!-- Regression Line -->
          <div v-if="points.length >= 2" class="regression-line-container">
             <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
               <line 
                 :x1="0" 
                 :y1="100 - getY(0)" 
                 :x2="100" 
                 :y2="100 - getY(100)" 
                 stroke="#ef4444" 
                 stroke-width="0.8" 
               />
             </svg>
          </div>
          
          <!-- Residuals (Optional visual aid) -->
          <div v-for="(p, i) in points" :key="'res'+i">
             <div 
               class="residual-line" 
               :style="{ 
                 left: p.x + '%', 
                 bottom: Math.min(p.y, getY(p.x)) + '%',
                 height: Math.abs(p.y - getY(p.x)) + '%' 
               }"
             ></div>
          </div>
          
          <div class="instruction-overlay" v-if="points.length === 0">
             Click anywhere to add data points
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
  x: number;
  y: number;
}

const points = ref<Point[]>([]);
const m = ref(0);
const b = ref(0);
const logs = ref<string[]>(['Ready. Click on the grid to add points.']);

const equationString = computed(() => {
   if (points.value.length < 2) return 'y = mx + b';
   const sign = b.value >= 0 ? '+' : '-';
   return `y = ${m.value.toFixed(2)}x ${sign} ${Math.abs(b.value).toFixed(2)}`;
});

const calculateRegression = () => {
  const n = points.value.length;
  if (n < 2) {
    m.value = 0;
    b.value = 0;
    return;
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points.value) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  m.value = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  b.value = (sumY - m.value * sumX) / n;
  
  logs.value.push(`Updated: m=${m.value.toFixed(2)}, b=${b.value.toFixed(2)}`);
};

const getY = (x: number) => {
   return m.value * x + b.value;
};

const addPoint = (e: MouseEvent) => {
  // Get percentage coordinates
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = 100 - ((e.clientY - rect.top) / rect.height) * 100;
  
  points.value.push({ x, y });
  calculateRegression();
};

const reset = () => {
  points.value = [];
  m.value = 0;
  b.value = 0;
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
}

.stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.label { font-size: 0.7rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; }
.value { font-family: 'Fira Code', monospace; font-weight: bold; color: #334155; }
.value.math { color: #2563eb; }

.action-btn {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}
.action-btn:hover { background: #f1f5f9; color: #ef4444; border-color: #fca5a5; }

.visualization-container {
  padding: 1rem;
  background: #fdfdfd;
  height: 350px;
  display: flex;
  justify-content: center;
}

.canvas-wrapper {
  width: 100%;
  max-width: 500px;
  height: 100%;
  border: 1px solid #bfdbfe;
  background: white;
  position: relative;
  cursor: crosshair;
  overflow: hidden;
  /* Simple grid pattern background */
  background-image: linear-gradient(#f1f5f9 1px, transparent 1px),
                    linear-gradient(90deg, #f1f5f9 1px, transparent 1px);
  background-size: 20px 20px;
}

.data-point {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, 50%); /* Center on coordinate */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  transition: all 0.2s;
  z-index: 10;
}

.data-point:hover { transform: translate(-50%, 50%) scale(1.5); }

.regression-line-container {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.line-svg {
  width: 100%;
  height: 100%;
}

.residual-line {
  position: absolute;
  width: 1px;
  background: #f59e0b;
  opacity: 0.4;
  pointer-events: none;
  border-left: 1px dashed #f59e0b;
  transform: translateX(-0.5px);
}

.instruction-overlay {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: #94a3b8;
  font-weight: bold;
  pointer-events: none;
  opacity: 0.6;
}

.console {
  background: #0f172a;
  color: #93c5fd;
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
