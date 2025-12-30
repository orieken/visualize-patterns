<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Visitor (Operation):</label>
        <div class="btn-group">
          <button @click="setVisitor('price')" :class="{ active: visitorType === 'price' }" :disabled="isAnimating">
            💰 PricingVisitor
          </button>
          <button @click="setVisitor('weight')" :class="{ active: visitorType === 'weight' }" :disabled="isAnimating">
            ⚖️ WeightVisitor
          </button>
          <button @click="setVisitor('export')" :class="{ active: visitorType === 'export' }" :disabled="isAnimating">
            📄 ExportVisitor
          </button>
        </div>
      </div>
      <button @click="runVisit" class="action-btn" :disabled="isAnimating">
         Visit Elements
      </button>
    </div>

    <div class="visualization-container">
       <div class="elements-list">
          <div 
             v-for="el in elements" 
             :key="el.id" 
             class="visitable-element"
             :class="{ active: currentElementId === el.id }"
          >
             <div class="el-icon">{{ el.icon }}</div>
             <div class="el-name">{{ el.name }}</div>
             <div class="el-meta">{{ el.type }}</div>
             
             <!-- Result bubble -->
             <div v-if="results[el.id]" class="result-bubble">
                {{ results[el.id] }}
             </div>
          </div>
       </div>

       <div class="visitor-card">
          <div class="visitor-avatar">🕵️</div>
          <div class="visitor-name">{{ visitorName }}</div>
          <div class="visitor-desc">"I visit elements and do {{ visitorAction }}!"</div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type VisitorType = 'price' | 'weight' | 'export';

interface Element {
  id: number;
  type: 'Book' | 'Fruit' | 'Gadget';
  name: string;
  icon: string;
  price: number;
  weight: number; // kg
}

const elements = ref<Element[]>([
  { id: 1, type: 'Book', name: 'Design Patterns', icon: '📕', price: 50, weight: 1.2 },
  { id: 2, type: 'Fruit', name: 'Watermelon', icon: '🍉', price: 5, weight: 4.0 },
  { id: 3, type: 'Gadget', name: 'iPad', icon: '📱', price: 800, weight: 0.5 },
  { id: 4, type: 'Book', name: 'Vue Guide', icon: '📗', price: 30, weight: 0.8 }
]);

const visitorType = ref<VisitorType>('price');
const currentElementId = ref<number | null>(null);
const results = ref<Record<number, string>>({});
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Select a Visitor operation and run it on the elements.']);

const visitorName = computed(() => {
  if (visitorType.value === 'price') return 'PricingVisitor';
  if (visitorType.value === 'weight') return 'WeightVisitor';
  return 'ExportVisitor';
});

const visitorAction = computed(() => {
  if (visitorType.value === 'price') return 'calculate total cost';
  if (visitorType.value === 'weight') return 'calculate shipping weight';
  return 'generate XML/JSON export';
});

const setVisitor = (t: VisitorType) => {
  if (isAnimating.value) return;
  visitorType.value = t;
  results.value = {};
  currentElementId.value = null;
  logs.value.push(`Switched to ${visitorName.value}.`);
};

const runVisit = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  results.value = {}; // clear previous
  
  logs.value.push(`Visitor: Starting tour...`);

  for (const el of elements.value) {
     currentElementId.value = el.id;
     
     // Simulation of Double Dispatch:
     // el.accept(visitor) -> visitor.visitBook(el)
     logs.value.push(`Element (${el.name}) accepts visitor.`);
     await delay(400);
     
     const res = calculateResult(el, visitorType.value);
     results.value[el.id] = res;
     
     logs.value.push(`${visitorName.value}: Visited ${el.type}. Result: ${res}`);
     await delay(600);
  }
  
  currentElementId.value = null;
  logs.value.push('Tour complete.');
  isAnimating.value = false;
};

const calculateResult = (el: Element, vType: VisitorType): string => {
  if (vType === 'price') {
    return `$${el.price}`;
  } else if (vType === 'weight') {
    return `${el.weight}kg`;
  } else {
    // Export
    return `<${el.type}>${el.name}</${el.type}>`;
  }
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
  background: #f59e0b;
  color: white;
  border-color: #d97706;
}

.action-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover:not(:disabled) { background: #d97706; }
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  padding: 2rem;
  background: #fffbeb; /* Light yellow bg */
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.elements-list {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.visitable-element {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.3s;
}

.visitable-element.active {
  border-color: #f59e0b;
  transform: scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
  z-index: 10;
}

.el-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.el-name { font-weight: bold; font-size: 0.85rem; text-align: center; color: #1e293b; }
.el-meta { font-size: 0.7rem; color: #94a3b8; margin-top: 0.2rem; }

.result-bubble {
  position: absolute;
  top: -15px;
  right: -10px;
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.visitor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: 1px solid #fcd34d;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.visitor-avatar { font-size: 2rem; }
.visitor-name { font-weight: 800; color: #b45309; }
.visitor-desc { font-style: italic; color: #78350f; border-left: 2px solid #fcd34d; padding-left: 0.8rem; }

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

@keyframes pop {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>
