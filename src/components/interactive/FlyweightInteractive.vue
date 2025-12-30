<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="info">
         Flyweight Pattern: Sharing common state (Tree Models) to save memory.
      </div>
      <div class="actions">
         <button @click="plantForest(100)" class="action-btn" :disabled="isAnimating">
           🌲 Plant 100 Trees
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="stats-panel">
      <div class="stat-box">
         <div class="label">Trees Rendered</div>
         <div class="value">{{ trees.length }}</div>
      </div>
      <div class="stat-box">
         <div class="label">Flyweights (Types)</div>
         <div class="value">{{ flyweightCount }}</div>
      </div>
      <div class="stat-box highlight">
         <div class="label">Est. Memory (Naive)</div>
         <div class="value">{{ (trees.length * 10).toLocaleString() }} MB</div>
         <div class="sub">Assuming 10MB/tree</div>
      </div>
      <div class="stat-box highlight good">
         <div class="label">Est. Memory (Flyweight)</div>
         <div class="value">{{ (flyweightCount * 10 + trees.length * 0.01).toFixed(2) }} MB</div>
         <div class="sub">Shared Models + lightweight refs</div>
      </div>
    </div>

    <div class="visualization-container">
       <div class="forest-canvas">
          <transition-group name="pop">
            <div 
              v-for="tree in trees" 
              :key="tree.id" 
              class="tree"
              :style="{ left: tree.x + '%', top: tree.y + '%', color: tree.color }"
              :title="tree.type"
            >
               {{ tree.icon }}
            </div>
          </transition-group>
          <div v-if="trees.length === 0" class="placeholder">
            Forest is empty. Plant some trees!
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

// Flyweight: The TreeType containing intrinsic state (color, icon, texture data etc)
interface TreeType {
  name: string;
  color: string;
  icon: string;
}

// Context: The unique tree instance containing extrinsic state (x, y)
interface Tree {
  id: number;
  x: number;
  y: number;
  type: string; // Reference to Flyweight key
  // Helpers for template convenience, normally resolved via factory
  color: string;
  icon: string;
}

// Factory to manage flyweights
const treeFactory = new Map<string, TreeType>();

const getTreeType = (name: string, color: string, icon: string) => {
  if (!treeFactory.has(name)) {
    treeFactory.set(name, { name, color, icon });
    logs.value.push(`Factory: Created new Flyweight for '${name}' trees.`);
  }
  return treeFactory.get(name)!;
};

const trees = ref<Tree[]>([]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Plant massive amounts of trees efficiently.']);
let nextId = 1;

const flyweightCount = computed(() => treeFactory.size);

const plantForest = async (count: number) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  logs.value.push(`Planting ${count} trees... Reusing existing TreeTypes.`);
  
  // Simulation of planting batch
  const BATCH_SIZE = 10;
  for (let i = 0; i < count; i += BATCH_SIZE) {
     for (let j = 0; j < BATCH_SIZE; j++) {
        const typeIdx = Math.floor(Math.random() * 3);
        let typeName = 'Oak';
        let color = '#166534';
        let icon = '🌳';

        if (typeIdx === 1) {
            typeName = 'Pine';
            color = '#14532d';
            icon = '🌲';
        } else if (typeIdx === 2) {
            typeName = 'Sakura';
            color = '#db2777';
            icon = '🌸';
        }

        // Get Flyweight
        const type = getTreeType(typeName, color, icon);
        
        trees.value.push({
            id: nextId++,
            x: Math.random() * 90 + 5,
            y: Math.random() * 80 + 10,
            type: type.name,
            color: type.color,
            icon: type.icon
        });
     }
     // Small yield for animation
     await new Promise(r => setTimeout(r, 50));
  }
  
  isAnimating.value = false;
  logs.value.push(`Forest planted. Total ${trees.value.length} trees using only ${flyweightCount.value} shared objects.`);
};

const reset = () => {
  trees.value = [];
  nextId = 1;
  // We can optionally clear factory, but Flyweights usually persist. 
  // Let's clear for demo cleanliness.
  treeFactory.clear();
  logs.value = ['Forest cleared.'];
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

.info {
  font-size: 0.8rem;
  color: #64748b;
  max-width: 50%;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #15803d; /* Green */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #166534; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.stats-panel {
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
}

.stat-box {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
}

.stat-box.highlight {
  background: #fff1f2;
  border-color: #fecdd3;
}
.stat-box.highlight.good {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.stat-box .label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: bold; }
.stat-box .value { font-size: 1.1rem; font-weight: 800; color: #334155; margin: 0.2rem 0; }
.stat-box .sub { font-size: 0.65rem; color: #94a3b8; }

.visualization-container {
  padding: 1rem;
  background: #ecfdf5; /* Light green bg */
  height: 300px;
  overflow: hidden;
  position: relative;
}

.forest-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

.tree {
  position: absolute;
  font-size: 1.5rem;
  transform: translate(-50%, -100%); /* Anchor at bottom center */
  transition: all 0.5s;
}

.placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #a7f3d0;
  font-weight: bold;
  font-size: 1.2rem;
}

.console {
  background: #0f172a;
  color: #86efac;
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
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s;
}
.pop-enter-from {
  opacity: 0;
  transform: translate(-50%, -100%) scale(0);
}
</style>
