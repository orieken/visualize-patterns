<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="status-panel">
         <span>Client expects: <strong>RoundPeg</strong></span>
         <span>Available: <strong>SquarePeg</strong></span>
      </div>

      <div class="actions">
         <button @click="tryFit" class="action-btn" :disabled="isAnimating">
           Insert Peg
         </button>
         <button @click="toggleAdapter" class="action-btn secondary" :disabled="isAnimating">
           {{ hasAdapter ? 'Remove Adapter' : 'Use Adapter' }}
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="system-boundary">
          <div class="hole round-hole"></div>
          <div class="label">Client Interface</div>
       </div>

       <div class="peg-container" :class="{ 'with-adapter': hasAdapter, 'animating': isAnimating, 'success': isSuccess, 'fail': isFail }">
          <div class="peg square-peg">
             <span class="peg-label">Square</span>
          </div>
          <div v-if="hasAdapter" class="adapter-wrapper">
             <span class="adapter-label">Adapter</span>
          </div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hasAdapter = ref(false);
const isAnimating = ref(false);
const isSuccess = ref(false);
const isFail = ref(false);
const logs = ref<string[]>(['Ready. Client needs a RoundPeg, but we only have a SquarePeg.']);

const toggleAdapter = () => {
    hasAdapter.value = !hasAdapter.value;
    isSuccess.value = false;
    isFail.value = false;
    logs.value.push(hasAdapter.value 
      ? 'Adapter equipped. SquarePeg is now wrapped in RoundPegAdapter.' 
      : 'Adapter removed. Back to raw SquarePeg.');
};

const tryFit = () => {
    if (isAnimating.value) return;
    isAnimating.value = true;
    isSuccess.value = false;
    isFail.value = false;
    
    logs.value.push('Attempting to insert peg into hole...');
    
    setTimeout(() => {
        if (hasAdapter.value) {
            isSuccess.value = true;
            logs.value.push('Success! Adapter converted interface calls.');
            logs.value.push('Log: roundPeg.getRadius() -> squarePeg.getWidth() * Math.sqrt(2)/2');
        } else {
            isFail.value = true;
            logs.value.push('Failed! Interface mismatch.');
            logs.value.push('Error: Expected RoundPeg, got SquarePeg.');
        }
        
        setTimeout(() => {
            isAnimating.value = false;
            // Don't auto-reset success state so they can see result
        }, 1000);
    }, 600); // Wait for move animation part
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
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.status-panel {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #f59e0b; /* Amber */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #d97706; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: white;
  color: #f59e0b;
  border: 1px solid #f59e0b;
}

.visualization-container {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 2rem 4rem;
  height: 250px;
  background: #fffbeb; /* Light amber bg */
  overflow: hidden;
}

.system-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hole {
  width: 100px;
  height: 100px;
  background: #1e293b;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

.round-hole {
  border-radius: 50%;
}

.label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
}

.peg-container {
  position: relative;
  width: 100px; 
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.peg {
  width: 70px;
  height: 70px;
  background: #f59e0b;
  display: grid;
  place-items: center;
  font-weight: bold;
  color: white;
  font-size: 0.8rem;
  z-index: 2;
  transition: all 0.3s;
}

.square-peg {
  border-radius: 4px; /* Slightly rounded corners but mostly square */
}

.adapter-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #3b82f6; /* Blue adapter ring */
  background: rgba(59, 130, 246, 0.2);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1;
}

.adapter-label {
  font-size: 0.6rem;
  color: #1d4ed8;
  background: white;
  padding: 0 4px;
  border-radius: 4px;
  margin-top: -10px;
  font-weight: bold;
}

/* Animations */
.peg-container.animating {
  transform: translateX(-140px); /* Move towards hole */
}

.peg-container.fail {
  animation: bounce-back 0.4s forwards;
}

.peg-container.success {
  transform: translateX(-140px) scale(0.9); /* Fit inside */
  opacity: 0; /* Disappear into hole */
  transition: all 0.6s ease 0.4s; /* Fade after moving */
}

@keyframes bounce-back {
  0% { transform: translateX(-140px); }
  50% { transform: translateX(-120px); } /* Bounce off */
  100% { transform: translateX(0px); }   /* Return */
}

.console {
  background: #0f172a;
  color: #fcd34d;
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
