<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Data Miner Type:</label>
        <div class="btn-group">
          <button @click="setMiner('pdf')" :class="{ active: minerType === 'pdf' }" :disabled="isAnimating">
            📄 PDF Miner
          </button>
          <button @click="setMiner('csv')" :class="{ active: minerType === 'csv' }" :disabled="isAnimating">
            📊 CSV Miner
          </button>
        </div>
      </div>
      <button @click="runPipeline" class="action-btn" :disabled="isAnimating">
         Run "mineData()"
      </button>
    </div>

    <div class="visualization-container">
       <div class="pipeline-view">
          <div 
             v-for="(step, idx) in steps" 
             :key="step.name" 
             class="pipeline-step"
             :class="{ 
               active: currentStep === idx, 
               completed: currentStep > idx,
               custom: step.isCustom 
             }"
          >
             <div class="step-icon">{{ step.icon }}</div>
             <div class="step-name">{{ step.name }}</div>
             <div class="step-desc" v-if="currentStep === idx || step.isCustom">
               {{ getStepDescription(step, minerType) }}
             </div>
          </div>
       </div>

       <div class="console-box" v-if="lastLog">
         <span class="console-label">System Output:</span>
         <span class="console-text">{{ lastLog }}</span>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type MinerType = 'pdf' | 'csv';

interface Step {
  name: string;
  icon: string;
  isCustom: boolean; // True if subclasses override this
}

// Skeleton structure
const steps: Step[] = [
  { name: 'OpenFile', icon: '📂', isCustom: true },  
  { name: 'ParseData', icon: '🔍', isCustom: true },  
  { name: 'Analyze', icon: '🧠', isCustom: false },  // Base method
  { name: 'SendReport', icon: '📨', isCustom: false }, // Base method
  { name: 'CloseFile', icon: '🔒', isCustom: true }
];

const minerType = ref<MinerType>('pdf');
const isAnimating = ref(false);
const currentStep = ref(-1);
const lastLog = ref('');
const logs = ref<string[]>(['Ready. Select a subclass (PDF or CSV) and run the Template Method.']);

const setMiner = (t: MinerType) => {
  if (isAnimating.value) return;
  minerType.value = t;
  currentStep.value = -1;
  lastLog.value = '';
  logs.value.push(`Context: Switched to ${t.toUpperCase()} DataMiner subclass.`);
};

const getStepDescription = (step: Step, type: MinerType) => {
  if (!step.isCustom) return 'Common Implementation (Base Class)';
  
  if (step.name === 'OpenFile') {
    return type === 'pdf' ? 'Opening binary PDF stream...' : 'Opening text CSV file...';
  }
  if (step.name === 'ParseData') {
    return type === 'pdf' ? 'OCR scanning & text extraction...' : 'Splitting by comma delimiter...';
  }
  if (step.name === 'CloseFile') {
    return 'Closing file handle.';
  }
  return '';
};

const runPipeline = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  logs.value.push(`Running mineData() template method on ${minerType.value.toUpperCase()}Miner...`);
  
  for (let i = 0; i < steps.length; i++) {
     currentStep.value = i;
     const step = steps[i];
     
     if (step.isCustom) {
        lastLog.value = `Subclass Override: ${getStepDescription(step, minerType.value)}`;
        logs.value.push(`Step ${i+1}: ${step.name} [Overridden]`);
     } else {
        lastLog.value = `Base Class: Running shared logic for ${step.name}...`;
        logs.value.push(`Step ${i+1}: ${step.name} [Shared]`);
     }
     
     await delay(1200);
  }
  
  currentStep.value = steps.length; // Complete
  lastLog.value = 'Pipeline Complete.';
  logs.value.push('Template Method finished.');
  isAnimating.value = false;
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

.panel label { font-weight: bold; font-size: 0.8rem; color: #64748b; }

.btn-group { display: flex; gap: 0.5rem; }

.btn-group button {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
  font-weight: 500;
}

.btn-group button.active {
  background: #a855f7; /* Purple */
  color: white;
  border-color: #7e22ce;
}

.action-btn {
  background: #a855f7;
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover:not(:disabled) { background: #9333ea; }
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  padding: 2rem;
  background: #faf5ff; /* Light purple bg */
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.pipeline-view {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  position: relative;
  transition: all 0.3s;
  padding: 1rem 0.5rem;
  background: white;
  border: 1px solid #e9d5ff;
  border-radius: 8px;
}

.pipeline-step::after {
  content: '➔';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: #d8b4fe;
  font-size: 1.2rem;
}
.pipeline-step:last-child::after { display: none; }

.pipeline-step.custom {
  border-color: #c084fc;
  border-width: 2px;
  border-style: dashed;
}

.pipeline-step.active {
  background: #f3e8ff;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
  z-index: 10;
  border-color: #a855f7;
  border-style: solid;
}

.pipeline-step.completed {
  opacity: 0.6;
  background: #f3f4f6;
}

.step-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.step-name { font-size: 0.75rem; font-weight: bold; color: #581c87; margin-bottom: 0.5rem; text-align: center; }

.step-desc {
  font-size: 0.6rem;
  color: #6b21a8;
  text-align: center;
  background: #e9d5ff;
  padding: 2px 4px;
  border-radius: 4px;
  position: absolute;
  bottom: -30px;
  width: 140px;
  z-index: 20;
}

.console-box {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-family: monospace;
  font-size: 0.85rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.console-label { color: #818cf8; font-weight: bold; }

.console {
  background: #0f172a;
  color: #d8b4fe;
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
