<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Route Strategy:</label>
        <div class="btn-group">
          <button @click="setStrategy('road')" :class="{ active: strategy === 'road' }" :disabled="isAnimating">
            🚗 Road
          </button>
          <button @click="setStrategy('walk')" :class="{ active: strategy === 'walk' }" :disabled="isAnimating">
            🚶 Walk
          </button>
          <button @click="setStrategy('transit')" :class="{ active: strategy === 'transit' }" :disabled="isAnimating">
            🚌 Transit
          </button>
        </div>
      </div>
      <button @click="calculateRoute" class="action-btn" :disabled="isAnimating">
         Calculate Route
      </button>
    </div>

    <div class="visualization-container">
       <div class="map-view">
          <div class="location start">🏠 A</div>
          <div class="location end">📍 B</div>
          
          <svg class="route-overlay" viewBox="0 0 300 150">
             <!-- Paths for different strategies -->
             <path v-if="strategy === 'road' && showPath" d="M 40 75 Q 150 10 260 75" class="path road" />
             <path v-if="strategy === 'walk' && showPath" d="M 40 75 Q 150 140 260 75" class="path walk" />
             <path v-if="strategy === 'transit' && showPath" d="M 40 75 L 100 75 L 200 75 L 260 75" class="path transit" />
             
             <!-- Animated marker -->
             <circle v-if="showPath && isAnimating" r="6" fill="#ef4444">
                <animateMotion 
                   :dur="animDuration" 
                   repeatCount="1" 
                   :path="currentPathD"
                />
             </circle>
          </svg>
       </div>
       
       <div class="info-panel" v-if="result">
          <div class="info-title">Route Details</div>
          <div class="info-stat">
             <span class="label">Distance:</span>
             <span class="value">{{ result.distance }}</span>
          </div>
          <div class="info-stat">
             <span class="label">Time:</span>
             <span class="value highlight">{{ result.time }}</span>
          </div>
          <div class="info-stat">
             <span class="label">Cost:</span>
             <span class="value">{{ result.cost }}</span>
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

type StrategyType = 'road' | 'walk' | 'transit';

interface RouteResult {
  distance: string;
  time: string;
  cost: string;
}

const strategy = ref<StrategyType>('road');
const isAnimating = ref(false);
const showPath = ref(false);
const result = ref<RouteResult | null>(null);
const logs = ref<string[]>(['Ready. Select a strategy to calculate the best route.']);

const setStrategy = (s: StrategyType) => {
  if (isAnimating.value) return;
  strategy.value = s;
  showPath.value = false;
  result.value = null;
  logs.value.push(`Context: Switched Strategy to '${s.toUpperCase()}'.`);
};

const calculateRoute = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  showPath.value = false;
  result.value = null;
  
  logs.value.push(`Context: Delegating calculation to ${strategy.value}Strategy...`);
  
  await delay(500);
  
  showPath.value = true;
  
  // Wait for animation (simulated calculation + visual travel)
  await delay(strategy.value === 'road' ? 1000 : strategy.value === 'transit' ? 1500 : 2500);
  
  // Set result based on strategy
  if (strategy.value === 'road') {
    result.value = { distance: '15 km', time: '20 min', cost: '$5.00 (Fuel)' };
  } else if (strategy.value === 'walk') {
    result.value = { distance: '12 km', time: '3 hours', cost: '$0.00' };
  } else {
    result.value = { distance: '18 km', time: '45 min', cost: '$2.50 (Ticket)' };
  }
  
  logs.value.push(`Strategy: Found route. Duration: ${result.value.time}`);
  isAnimating.value = false;
};

const currentPathD = computed(() => {
  if (strategy.value === 'road') return "M 40 75 Q 150 10 260 75";
  if (strategy.value === 'walk') return "M 40 75 Q 150 140 260 75";
  return "M 40 75 L 100 75 L 200 75 L 260 75";
});

const animDuration = computed(() => {
  if (strategy.value === 'road') return "1s";
  if (strategy.value === 'transit') return "1.5s";
  return "2.5s";
});

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
  padding: 0.75rem;
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

.btn-group {
  display: flex;
  gap: 0.5rem;
}

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
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.action-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover:not(:disabled) { background: #059669; }
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  padding: 2rem;
  background: #f0f9ff;
  min-height: 280px;
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.map-view {
  width: 300px;
  height: 150px;
  background: white;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  position: relative;
}

.location {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 2;
}
.start { top: 60px; left: 10px; }
.end { top: 60px; right: 10px; }

.route-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.path {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: draw 1s ease-out;
}

.path.road { stroke: #3b82f6; }
.path.walk { stroke: #f59e0b; stroke-dasharray: 10 5; }
.path.transit { stroke: #8b5cf6; stroke-width: 6; }

@keyframes draw {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.info-panel {
  width: 160px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  animation: slide-in 0.3s ease-out;
}

.info-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #64748b;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.4rem;
}

.info-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.label { color: #94a3b8; }
.value { font-weight: bold; color: #334155; }
.value.highlight { color: #10b981; }

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

@keyframes slide-in {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
