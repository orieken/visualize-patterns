<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="menu">
        <label>Base:</label>
        <button class="base-btn" disabled>☕ Espresso ($2.00)</button>
      </div>
      <div class="menu">
        <label>Add Decorators:</label>
        <button @click="addDecorator('milk')" :disabled="isAnimating">🥛 Milk (+$0.50)</button>
        <button @click="addDecorator('whip')" :disabled="isAnimating">☁️ Whip (+$0.70)</button>
        <button @click="addDecorator('mocha')" :disabled="isAnimating">🍫 Mocha (+$0.90)</button>
      </div>
      <div class="actions">
         <button @click="calculateFinal" class="action-btn" :disabled="isAnimating">
           Print Bill
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="cup-stack">
          <!-- Stack renders top to bottom visually -->
          <transition-group name="stack">
             <div 
               v-for="(layer, idx) in layers.slice().reverse()" 
               :key="layer.id" 
               class="layer"
               :class="[layer.type, { active: activeLayerId === layer.id }]"
               :style="{ zIndex: layers.length - idx }"
             >
                <span class="layer-name">{{ layer.name }}</span>
                <span class="layer-cost">+${{ layer.cost.toFixed(2) }}</span>
             </div>
          </transition-group>
          
          <div class="layer base" :class="{ active: activeLayerId === 'base' }">
             <span class="layer-name">Espresso</span>
             <span class="layer-cost">$2.00</span>
          </div>
       </div>

       <div class="bill-panel" :class="{ visible: showBill }">
          <div class="bill-title">Receipt</div>
          <div class="bill-line">
            <span>Description:</span>
            <strong>{{ fullDescription }}</strong>
          </div>
          <div class="bill-line total">
            <span>Total:</span>
            <strong>${{ totalCost.toFixed(2) }}</strong>
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

interface Layer {
  id: number;
  type: 'milk' | 'whip' | 'mocha';
  name: string;
  cost: number;
}

const layers = ref<Layer[]>([]);
const isAnimating = ref(false);
const activeLayerId = ref<number | string | null>(null);
const showBill = ref(false);
const logs = ref<string[]>(['Ready. Start with a plain Espresso. Add decorators.']);

let idCounter = 1;

const addDecorator = (type: Layer['type']) => {
  if (isAnimating.value) return;
  showBill.value = false;
  
  const layer: Layer = {
     id: idCounter++,
     type,
     name: type.charAt(0).toUpperCase() + type.slice(1),
     cost: type === 'milk' ? 0.5 : type === 'whip' ? 0.7 : 0.9
  };
  
  layers.value.push(layer);
  logs.value.push(`Wrapped with new ${layer.name}Decorator.`);
};

const fullDescription = computed(() => {
  const extras = layers.value.map(l => l.name).join(', ');
  return `Espresso${extras ? ', ' + extras : ''}`;
});

const totalCost = computed(() => {
  return 2.0 + layers.value.reduce((sum, l) => sum + l.cost, 0);
});

const calculateFinal = async () => {
   if (isAnimating.value) return;
   isAnimating.value = true;
   showBill.value = false;
   logs.value.push('Calculating cost()... Calling outer-most decorator.');
   
   // Traverse down
   for (let i = layers.value.length - 1; i >= 0; i--) {
      activeLayerId.value = layers.value[i].id;
      logs.value.push(`${layers.value[i].name} delegates to next component...`);
      await delay(400);
   }
   
   activeLayerId.value = 'base';
   logs.value.push('Base Espresso returns $2.00.');
   await delay(400);
   
   // Bubble up (conceptually)
   activeLayerId.value = null;
   logs.value.push('Unwinding stack: Adding costs...');
   showBill.value = true;
   logs.value.push(`Total: $${totalCost.value.toFixed(2)}`);
   
   isAnimating.value = false;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const reset = () => {
  layers.value = [];
  showBill.value = false;
  activeLayerId.value = null;
  logs.value = ['Ready.'];
  idCounter = 1;
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
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  width: 100px;
}

.menu button {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  color: #334155;
}

.menu button:hover:not(:disabled) {
  border-color: #64748b;
  background: #f1f5f9;
}

.base-btn {
  background: #78350f !important;
  color: white !important;
  border: none !important;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  height: 350px;
  background: #fff7ed; /* Light orange/cream */
}

.cup-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  position: relative;
}

.layer {
  width: 100%;
  padding: 0.6rem;
  margin-top: -5px; /* Overlap */
  border-radius: 8px;
  border: 2px solid #9a3412;
  background: white;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: all 0.3s;
  position: relative;
}

.layer.active {
  border-color: #f59e0b; /* Highlight */
  transform: scale(1.05);
  z-index: 100 !important;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.layer.base {
  background: #451a03;
  color: white;
  z-index: 0;
  height: 60px;
  align-items: center;
  margin-top: -5px;
  border-radius: 0 0 20px 20px;
}

.layer.milk { background: #fdfbf7; color: #4b5563; border-color: #d1d5db; }
.layer.whip { background: #fff; border: 2px dashed #9ca3af; color: #6b7280; }
.layer.mocha { background: #5f3728; color: #fcd34d; border-color: #451a03; }

.bill-panel {
  background: white;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  width: 240px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bill-panel.visible {
  opacity: 1;
  transform: translateY(0);
}

.bill-title {
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 0.5rem;
  color: #334155;
}

.bill-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #475569;
}

.bill-line.total {
  border-top: 2px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #0ea5e9;
}

.console {
  background: #0f172a;
  color: #fdba74;
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

.stack-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.stack-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
</style>
