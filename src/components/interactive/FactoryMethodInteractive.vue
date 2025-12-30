<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="control-group">
        <label>Creator Type:</label>
        <div class="btn-group">
          <button 
            @click="setCreator('road')" 
            class="choice-btn"
            :class="{ active: creatorType === 'road' }"
            :disabled="isAnimating"
          >
            Road Logistics
          </button>
          <button 
            @click="setCreator('sea')" 
            class="choice-btn"
            :class="{ active: creatorType === 'sea' }"
            :disabled="isAnimating"
          >
            Sea Logistics
          </button>
        </div>
      </div>

      <button @click="createProduct" class="action-btn" :disabled="isAnimating">
        Call factoryMethod()
      </button>
    </div>

    <div class="visualization-container">
      <!-- Diagram / Flow -->
      <div class="factory-floor">
        <div class="creator-box">
          <div class="creator-label">
             <span class="muted">class </span> <strong>{{ creatorName }}</strong>
          </div>
          <div class="method-block">
             <div class="method-sig">createTransport(): {{ productType }}</div>
             <div class="method-body">
                return new <strong>{{ productName }}</strong>();
             </div>
          </div>
        </div>

        <div class="arrow-down">⬇ creates</div>

        <div class="product-area">
           <transition name="product-appear">
             <div v-if="currentProduct" class="product-card" :class="currentProduct.type">
                <div class="icon">{{ currentProduct.icon }}</div>
                <div class="name">{{ currentProduct.name }}</div>
                <div class="action">{{ currentProduct.action }}</div>
             </div>
           </transition>
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

type CreatorType = 'road' | 'sea';

interface Product {
  type: CreatorType;
  name: string;
  icon: string;
  action: string;
}

const creatorType = ref<CreatorType>('road');
const isAnimating = ref(false);
const currentProduct = ref<Product | null>(null);
const logs = ref<string[]>(['Ready. Select a Logistics type and call the Factory Method.']);

const creatorName = computed(() => creatorType.value === 'road' ? 'RoadLogistics' : 'SeaLogistics');
const productName = computed(() => creatorType.value === 'road' ? 'Truck' : 'Ship');
const productType = computed(() => 'Transport');

const setCreator = (type: CreatorType) => {
  creatorType.value = type;
  currentProduct.value = null; // Reset visual
  logs.value.push(`Client selected creator: ${creatorName.value}.`);
};

const createProduct = () => {
  if (isAnimating.value) return;
  
  isAnimating.value = true;
  currentProduct.value = null;
  
  logs.value.push(`Calling ${creatorName.value}.createTransport()...`);
  
  setTimeout(() => {
    // Simulate instantiation
    if (creatorType.value === 'road') {
       currentProduct.value = { 
         type: 'road', 
         name: 'Truck', 
         icon: '🚚', 
         action: 'Delivers by land in a box.' 
       };
    } else {
       currentProduct.value = { 
         type: 'sea', 
         name: 'Ship', 
         icon: '🚢', 
         action: 'Delivers by sea in a container.' 
       };
    }
    
    logs.value.push(`Factory returned a new ${currentProduct.value.name}.`);
    logs.value.push(`Result: ${currentProduct.value.action}`);
    
    setTimeout(() => {
      isAnimating.value = false;
    }, 500);
  }, 400); // Small delay for effect
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

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.btn-group {
  display: flex;
  background: #e2e8f0;
  border-radius: 6px;
  padding: 2px;
}

.choice-btn {
  background: transparent;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
}

.choice-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  font-weight: 600;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #2563eb; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.visualization-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  height: 280px;
  background: #f1f5f9;
}

.factory-floor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.creator-box {
  background: white;
  border: 2px solid #94a3b8;
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.creator-label {
  background: #f8fafc;
  padding: 0.4rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  font-family: monospace;
  font-size: 0.9rem;
}

.muted { color: #94a3b8; }

.method-block {
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  background: #fff;
}

.method-sig {
  color: #d97706; /* Amber */
  margin-bottom: 0.5rem;
}

.method-body {
  margin-left: 1rem;
  color: #475569;
}

.arrow-down {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
}

.product-area {
  height: 100px;
  width: 100%;
  display: grid;
  place-items: center;
}

.product-card {
  background: white;
  border: 2px solid;
  border-radius: 12px;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.product-card.road { border-color: #ef4444; color: #b91c1c; background: #fef2f2; }
.product-card.sea { border-color: #3b82f6; color: #1d4ed8; background: #eff6ff; }

.icon { font-size: 2.5rem; }
.name { font-weight: 800; text-transform: uppercase; font-size: 0.9rem; }
.action { font-size: 0.75rem; opacity: 0.8; margin-top: 0.2rem; }

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

.product-appear-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.product-appear-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
</style>
