<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="config-panel">
        <label>Prototype Configuration:</label>
        <div class="btn-group">
          <button @click="setColor('red')" class="color-btn red" :class="{ active: protoState.color === 'red' }"></button>
          <button @click="setColor('blue')" class="color-btn blue" :class="{ active: protoState.color === 'blue' }"></button>
          <button @click="setColor('green')" class="color-btn green" :class="{ active: protoState.color === 'green' }"></button>
        </div>
        <div class="btn-group">
          <button @click="setShape('circle')" class="shape-btn" :class="{ active: protoState.shape === 'circle' }">○ Circle</button>
          <button @click="setShape('square')" class="shape-btn" :class="{ active: protoState.shape === 'square' }">□ Square</button>
        </div>
      </div>

      <div class="actions">
         <button @click="clone" class="action-btn">
           Clone
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
      <div class="section prototype-section">
         <div class="section-label">Prototype Instance</div>
         <div class="shape-container">
            <div class="shape-object" :class="[protoState.color, protoState.shape]"></div>
         </div>
         <div class="mem-addr">Ref: #001</div>
      </div>
      
      <div class="arrow">
         ➔ clone() ➔
      </div>

      <div class="section clones-section">
         <div class="section-label">Clones</div>
         <div class="clones-grid">
           <transition-group name="pop">
             <div v-for="clone in clones" :key="clone.id" class="clone-card">
               <div class="shape-object small" :class="[clone.color, clone.shape]"></div>
               <div class="mem-addr">Ref: #{{ clone.id }}</div>
             </div>
           </transition-group>
           <div v-if="clones.length === 0" class="placeholder">No clones yet</div>
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

interface ShapeState {
  color: 'red' | 'blue' | 'green';
  shape: 'circle' | 'square';
}

interface CloneItem extends ShapeState {
  id: number;
}

const protoState = reactive<ShapeState>({
  color: 'red',
  shape: 'circle'
});

const clones = ref<CloneItem[]>([]);
const logs = ref<string[]>(['Ready. Configure the prototype and clone it.']);
let cloneIdCounter = 100;

const setColor = (c: ShapeState['color']) => {
  protoState.color = c;
  logs.value.push(`Prototype color set to ${c}.`);
};

const setShape = (s: ShapeState['shape']) => {
  protoState.shape = s;
  logs.value.push(`Prototype shape set to ${s}.`);
};

const clone = () => {
    cloneIdCounter++;
    // Create a copy (clone)
    const newClone: CloneItem = {
        color: protoState.color,
        shape: protoState.shape,
        id: cloneIdCounter
    };
    
    clones.value.push(newClone);
    logs.value.push(`Cloned: Created new object #${newClone.id} with state { ${newClone.color}, ${newClone.shape} }.`);
};

const reset = () => {
  clones.value = [];
  cloneIdCounter = 100;
  logs.value = ['Ready.'];
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

.config-panel {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.config-panel label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.btn-group {
  display: flex;
  gap: 0.3rem;
}

.color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.color-btn.red { background: #ef4444; }
.color-btn.blue { background: #3b82f6; }
.color-btn.green { background: #22c55e; }

.color-btn.active {
  border-color: #0f172a;
  transform: scale(1.1);
}

.shape-btn {
  background: #e2e8f0;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #475569;
}

.shape-btn.active {
  background: #cbd5e1;
  font-weight: 700;
  color: #1e293b;
}

.action-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #7c3aed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  height: 280px;
  background: #f5f3ff;
}

.section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 160px;
}

.prototype-section {
  width: 140px;
  border-color: #8b5cf6;
  box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);
}

.clones-section {
  flex: 1;
  max-width: 350px;
  background: #f8fafc;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: auto;
}

.shape-container {
  height: 80px;
  display: grid;
  place-items: center;
  margin-top: auto;
  margin-bottom: auto;
}

.clones-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
}

.clone-card {
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.shape-object {
  width: 60px;
  height: 60px;
  transition: all 0.3s;
}
.shape-object.small { width: 30px; height: 30px; }

.shape-object.red { background: #ef4444; }
.shape-object.blue { background: #3b82f6; }
.shape-object.green { background: #22c55e; }

.shape-object.circle { border-radius: 50%; }
.shape-object.square { border-radius: 4px; }

.mem-addr {
  font-family: monospace;
  font-size: 0.7rem;
  color: #94a3b8;
}

.arrow {
  color: #8b5cf6;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.placeholder {
  color: #cbd5e1;
  font-style: italic;
  font-size: 0.85rem;
}

.console {
  background: #0f172a;
  color: #a78bfa;
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

.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
</style>
