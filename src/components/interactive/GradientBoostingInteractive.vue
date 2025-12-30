<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <div class="stat-group">
           <div class="stat">
              <span class="label">Target:</span>
              <span class="value">{{ targetValue }}</span>
           </div>
           <div class="stat">
              <span class="label">Current Prediction:</span>
              <span class="value highlight">{{ currentTotal }}</span>
           </div>
           <div class="stat">
              <span class="label">Diff (Residual):</span>
              <span class="value err">{{ residual }}</span>
           </div>
        </div>
      </div>
      <div>
         <button @click="reset" class="reset-btn">Reset</button>
         <button @click="addLearner" class="action-btn" :disabled="isAnimating || residual === 0">
            + Add Weak Learner
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="chart-area">
          <!-- Reference Grid -->
          <div class="grid-line" style="bottom: 0px">0</div>
          <div class="grid-line" style="bottom: 100px">100</div>
          <div class="grid-line" style="bottom: 200px">200</div>
          
          <!-- Target Bar -->
          <div class="bar-group">
             <div class="bar target" :style="{ height: targetValue + 'px' }">
                <span class="bar-label">Target ({{ targetValue }})</span>
             </div>
          </div>
          
          <!-- Prediction Stack -->
          <div class="bar-group">
             <div class="stack-container">
                <transition-group name="stack">
                   <div 
                      v-for="(layer, i) in learners" 
                      :key="i"
                      class="stack-block"
                      :class="{'base': i===0}"
                      :style="{ height: layer.value + 'px' }"
                   >
                     <span class="block-val" v-if="layer.value > 15">+{{ layer.value }}</span>
                   </div>
                </transition-group>
             </div>
             <div class="bar-label">Model ({{ currentTotal }})</div>
          </div>
       </div>
       
       <div class="residual-visual" v-if="residual !== 0">
          <div class="res-arrow">➜</div>
          <div class="res-box">
             <div class="res-title">Next Model Learning Goal:</div>
             <div class="res-val text-red">Error = {{ residual }}</div>
          </div>
       </div>
       <div class="residual-visual" v-else>
          <div class="res-box success">
             <div class="res-title">Perfect Fit!</div>
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

interface Learner {
  id: number;
  value: number;
  isBase: boolean;
}

const targetValue = 250;
const learners = ref<Learner[]>([
   { id: 0, value: 50, isBase: true } // Initial base prediction (e.g. mean)
]);

const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Gradient Boosting builds models sequentially. Start with a base guess of 50.']);

const currentTotal = computed(() => {
   return learners.value.reduce((sum, l) => sum + l.value, 0);
});

const residual = computed(() => {
   return targetValue - currentTotal.value;
});

const addLearner = async () => {
   if (isAnimating.value) return;
   isAnimating.value = true;
   
   const currentRes = residual.value;
   
   // In GB, we multiply by a Learning Rate (e.g. 0.3) to prevent overfitting/oscillating
   const learningRate = 0.5; 
   let prediction = Math.round(currentRes * learningRate);
   
   // Minimum step size for visual clarity
   if (prediction < 5 && currentRes > 0) prediction = Math.min(5, currentRes);
   
   logs.value.push(`Residual is ${currentRes}. New Learner predicts ~${(learningRate*100)}% of that: ${prediction}`);
   
   await delay(300);
   
   learners.value.push({
      id: learners.value.length,
      value: prediction,
      isBase: false
   });
   
   await delay(300);
   
   if (residual.value === 0) {
      logs.value.push('Converged! Error is 0.');
   }
   
   isAnimating.value = false;
};

const reset = () => {
   learners.value = [{ id: 0, value: 50, isBase: true }];
   logs.value = ['Reset to base prediction.'];
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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

.stat-group {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.label { font-size: 0.7rem; color: #94a3b8; font-weight: bold; text-transform: uppercase; }
.value { font-family: 'Fira Code', monospace; font-weight: bold; color: #334155; font-size: 1.1rem; }
.value.highlight { color: #2563eb; }
.value.err { color: #ef4444; }

.action-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-left: 1rem;
}
.action-btn:hover:not(:disabled) { background: #1d4ed8; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #94a3b8;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  margin-right: 0.5rem;
}

.visualization-container {
  padding: 2rem;
  background: #f0f9ff;
  min-height: 350px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3rem;
  position: relative;
}

.chart-area {
  display: flex;
  align-items: flex-end;
  gap: 4rem;
  position: relative;
  height: 300px;
  width: 300px;
  border-bottom: 2px solid #cbd5e1;
}

.grid-line {
  position: absolute;
  left: 0; right: 0;
  border-top: 1px dashed #cbd5e1;
  color: #94a3b8;
  font-size: 0.7rem;
  padding-left: 2px;
  pointer-events: none;
}

.bar-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 80px;
  position: relative;
  z-index: 2;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s;
}
.bar.target {
  background: #e2e8f0;
  border: 2px dashed #94a3b8;
}

.stack-container {
  display: flex;
  flex-direction: column-reverse; /* Stack upwards */
  width: 100%;
}

.stack-block {
  width: 100%;
  background: #3b82f6;
  border: 1px solid #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  transition: all 0.3s;
}
.stack-block.base { background: #94a3b8; border-color: #64748b; }

.bar-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: #64748b;
  position: absolute;
  bottom: -25px;
  white-space: nowrap;
}

.residual-visual {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.res-arrow {
  font-size: 2rem;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
}

.res-box {
  background: white;
  padding: 1rem;
  border: 2px solid #fecaca;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.res-box.success { border-color: #86efac; background: #f0fdf4; }

.res-title { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
.res-val { font-weight: bold; font-size: 1.1rem; }
.text-red { color: #ef4444; }

.stack-enter-active { animation: drop-in 0.4s ease-out; }
@keyframes drop-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.console {
  background: #0f172a;
  color: #93c5fd;
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
</style>
