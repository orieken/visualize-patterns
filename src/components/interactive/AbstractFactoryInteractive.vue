<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="control-group">
        <label>Select Style Family:</label>
        <div class="btn-group">
          <button 
            @click="setStyle('modern')" 
            class="choice-btn"
            :class="{ active: currentStyle === 'modern' }"
            :disabled="isAnimating"
          >
            Modern
          </button>
          <button 
            @click="setStyle('victorian')" 
            class="choice-btn"
            :class="{ active: currentStyle === 'victorian' }"
            :disabled="isAnimating"
          >
            Victorian
          </button>
        </div>
      </div>

      <button @click="createFamily" class="action-btn" :disabled="isAnimating">
        Create Family
      </button>
    </div>

    <div class="visualization-container">
      <div class="factory-floor">
        <div class="factory-header">
           <span class="muted">Factory: </span> 
           <strong>{{ currentStyle === 'modern' ? 'ModernFurnitureFactory' : 'VictorianFurnitureFactory' }}</strong>
        </div>
        
        <div class="output-area">
          <transition-group name="pop-in">
             <div v-for="(item, idx) in products" :key="item.name" class="product-card" :style="{ transitionDelay: `${idx * 150}ms` }">
                <div class="icon">{{ item.icon }}</div>
                <div class="name">{{ item.name }}</div>
             </div>
          </transition-group>
          
          <div v-if="products.length === 0 && !isAnimating" class="placeholder">
            Waiting for client order...
          </div>
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

type Style = 'modern' | 'victorian';

interface Product {
  name: string;
  icon: string;
}

const currentStyle = ref<Style>('modern');
const products = ref<Product[]>([]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Select a style family.']);

const setStyle = (style: Style) => {
  currentStyle.value = style;
  products.value = [];
  logs.value.push(`Client configured with: ${style === 'modern' ? 'ModernFactory' : 'VictorianFactory'}.`);
};

const createFamily = () => {
    if (isAnimating.value) return;
    
    isAnimating.value = true;
    products.value = [];
    
    logs.value.push(`Ordering furniture family from ${currentStyle.value} factory...`);
    
    setTimeout(() => {
        if (currentStyle.value === 'modern') {
            products.value = [
                { name: 'Modern Chair', icon: '🪑' }, // Generic chair icon
                { name: 'Modern Sofa', icon: '🛋️' },
                { name: 'Modern Table', icon: '⬜' }   // Square/sleek table
            ];
        } else {
            products.value = [
                { name: 'Victorian Chair', icon: '🪑' }, 
                { name: 'Victorian Sofa', icon: '🛋️' },
                { name: 'Victorian Table', icon: '🕰️' } // Or specific ornate icon
            ];
            // Let's differentiate icons slightly if possible or just use text description
        }
        
        logs.value.push(`Created matching set: ${products.value.map(p => p.name).join(', ')}.`);
        
        setTimeout(() => {
            isAnimating.value = false;
        }, 1000); // Wait for transition group
    }, 500);
}
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
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.visualization-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  height: 280px;
  background: #f5f3ff; /* Light purple bg */
}

.factory-floor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
}

.factory-header {
  font-family: monospace;
  font-size: 1rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.muted { color: #94a3b8; }

.output-area {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  height: 120px;
}

.placeholder {
  color: #94a3b8;
  font-style: italic;
  margin-top: 2rem;
}

.product-card {
  background: white;
  border: 2px solid;
  border-radius: 12px;
  width: 100px;
  padding: 1rem 0.5rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-color: #8b5cf6;
}

.icon { font-size: 2.5rem; }
.name { font-weight: 700; font-size: 0.75rem; color: #4b5563; }

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

.pop-in-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-in-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>
