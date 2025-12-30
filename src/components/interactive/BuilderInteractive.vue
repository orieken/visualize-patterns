<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="parts-panel">
        <label>Add Components:</label>
        <div class="btn-group">
          <button @click="addComponent('cpu')" :disabled="isBuilt || parts.cpu">
             Add CPU
          </button>
          <button @click="addComponent('gpu')" :disabled="isBuilt || parts.gpu">
             Add GPU
          </button>
          <button @click="addComponent('ram')" :disabled="isBuilt || parts.ram">
             Add RAM
          </button>
          <button @click="addComponent('ssd')" :disabled="isBuilt || parts.ssd">
             Add SSD
          </button>
        </div>
      </div>

      <div class="actions">
         <button @click="build" class="action-btn" :disabled="isBuilt || Object.keys(parts).length === 0">
           Build()
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
      <div class="workbench">
        <div class="pc-case">
           <div class="case-label">Computer Chassis</div>
           
           <transition-group name="part-drop">
             <div v-if="parts.cpu" class="part cpu" key="cpu">CPU: i9-13900K</div>
             <div v-if="parts.gpu" class="part gpu" key="gpu">GPU: RTX 4090</div>
             <div v-if="parts.ram" class="part ram" key="ram">RAM: 32GB DDR5</div>
             <div v-if="parts.ssd" class="part ssd" key="ssd">SSD: 1TB NVMe</div>
           </transition-group>

           <div v-if="isBuilt" class="built-overlay">
             <span>✓ System Ready</span>
           </div>
        </div>
      </div>
      
      <div class="code-preview">
         <div class="code-line">const builder = new ComputerBuilder();</div>
         <div class="code-line indent" :class="{ highlight: lastAction === 'cpu' }" v-if="parts.cpu">
            .setCPU('i9-13900K')
         </div>
         <div class="code-line indent" :class="{ highlight: lastAction === 'gpu' }" v-if="parts.gpu">
            .setGPU('RTX 4090')
         </div>
         <div class="code-line indent" :class="{ highlight: lastAction === 'ram' }" v-if="parts.ram">
            .setRAM('32GB')
         </div>
         <div class="code-line indent" :class="{ highlight: lastAction === 'ssd' }" v-if="parts.ssd">
            .setStorage('1TB')
         </div>
         <div class="code-line" v-if="isBuilt">
            const pc = builder.build();
         </div>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const parts = reactive({
  cpu: false,
  gpu: false,
  ram: false,
  ssd: false
});

const isBuilt = ref(false);
const lastAction = ref<string|null>(null);
const logs = ref<string[]>(['Ready. Use the Builder API to construct a Computer.']);

const addComponent = (part: keyof typeof parts) => {
  parts[part] = true;
  lastAction.value = part;
  logs.value.push(`builder.set${part.toUpperCase()}(...) called.`);
  
  // Clear highlight after short delay
  setTimeout(() => lastAction.value = null, 800);
};

const build = () => {
  isBuilt.value = true;
  logs.value.push('builder.build() called. Final Computer object created.');
};

const reset = () => {
  parts.cpu = false;
  parts.gpu = false;
  parts.ram = false;
  parts.ssd = false;
  isBuilt.value = false;
  lastAction.value = null;
  logs.value = ['Ready. Use the Builder API to construct a Computer.'];
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

.parts-panel {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.parts-panel label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-group button {
  background: #e2e8f0;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  color: #334155;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-group button:hover:not(:disabled) {
  background: #cbd5e1;
}

.btn-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #0284c7; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 2rem;
  height: 300px;
  background: #f0f9ff; /* Light sky blue */
}

.workbench {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pc-case {
  width: 200px;
  height: 240px;
  background: #1e293b;
  border-radius: 12px;
  border: 4px solid #334155;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 3rem 1rem 1rem 1rem;
  gap: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
}

.case-label {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #94a3b8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.part {
  background: #334155;
  color: white;
  padding: 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  text-align: center;
  border-left: 3px solid;
}

.part.cpu { border-color: #f43f5e; background: #3f151b; }
.part.gpu { border-color: #22c55e; background: #132a13; }
.part.ram { border-color: #f59e0b; background: #351e08; }
.part.ssd { border-color: #3b82f6; background: #121e36; }

.built-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  color: #22c55e;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.2rem;
  border-radius: 8px;
  backdrop-filter: blur(2px);
  animation: fade-in 0.3s ease;
}

.code-preview {
  background: #0f172a;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #94a3b8;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.code-line {
  min-height: 1.2rem;
}

.code-line.indent {
  padding-left: 1.5rem;
  color: #38bdf8;
}

.code-line.highlight {
  background: rgba(56, 189, 248, 0.2);
  color: white;
  border-radius: 4px;
}

.console {
  background: #0f172a;
  color: #7dd3fc;
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

.part-drop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.part-drop-enter-from {
  opacity: 0;
  transform: translateX(-50px) scale(0.5);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
