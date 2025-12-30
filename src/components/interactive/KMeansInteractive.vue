<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>K = {{ k }}</label>
        <div class="btn-group">
           <button @click="reset(2)" :class="{active: k===2}">2</button>
           <button @click="reset(3)" :class="{active: k===3}">3</button>
           <button @click="reset(4)" :class="{active: k===4}">4</button>
        </div>
        <button @click="step" class="action-btn" :disabled="points.length < k">
           Step ➜ ({{ phase }})
        </button>
        <button @click="clear" class="reset-btn">Clear Points</button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="plot-area" @click="addPoint">
          <!-- Background Grid -->
          <div class="grid-bg"></div>

          <!-- Areas (Voronoi-ish approximation or just coloring points) -->
          <!-- We'll just color points for simplicity -->

          <!-- Points -->
          <transition-group name="pop">
             <div 
                v-for="(p, i) in points" 
                :key="'p'+i" 
                class="data-point"
                :class="getColorClass(p.clusterIdx)"
                :style="{ left: p.x + '%', top: p.y + '%' }"
             ></div>
          </transition-group>
          
          <!-- Centroids -->
          <transition-group name="fade-move">
             <div 
                v-for="(c, i) in centroids" 
                :key="'c'+i" 
                class="centroid"
                :class="getColorClass(i)"
                :style="{ left: c.x + '%', top: c.y + '%' }"
             >
                <div class="crosshair"></div>
             </div>
          </transition-group>
          
          <div class="instruction-overlay" v-if="points.length === 0">
             Click to add data points.<br>Then click Step to assign clusters.
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

interface Point {
  x: number;
  y: number;
  clusterIdx: number; // -1 if unassigned
}

interface Centroid {
  x: number;
  y: number;
}

const k = ref(3);
const points = ref<Point[]>([]);
const centroids = ref<Centroid[]>([]);
// Phases: 'Assign' (points pick nearest centroid), 'Update' (centroids move to mean)
const phase = ref<'Assign' | 'Update'>('Assign'); 
const logs = ref<string[]>(['Ready. Add points, then use Step to run k-Means.']);

const getColorClass = (idx: number) => {
  if (idx === -1) return 'unassigned';
  if (idx === 0) return 'c0';
  if (idx === 1) return 'c1';
  if (idx === 2) return 'c2';
  return 'c3';
};

const addPoint = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  points.value.push({ x, y, clusterIdx: -1 });
};

const initializeCentroids = () => {
   // Randomly pick k points as initial centroids
   if (points.value.length < k.value) {
      logs.value.push(`Need at least ${k.value} points to start.`);
      return;
   }
   
   const shuffled = [...points.value].sort(() => 0.5 - Math.random());
   centroids.value = shuffled.slice(0, k.value).map(p => ({ x: p.x, y: p.y }));
   logs.value.push(`Initialized ${k.value} centroids at random points.`);
};

const step = async () => {
   if (centroids.value.length === 0) {
      initializeCentroids();
      phase.value = 'Assign';
      return;
   }

   if (phase.value === 'Assign') {
      // Assign points to nearest centroid
      let changes = 0;
      points.value.forEach(p => {
         let minDist = Infinity;
         let bestIdx = -1;
         
         centroids.value.forEach((c, idx) => {
            const dx = p.x - c.x;
            const dy = p.y - c.y; // Aspect ratio ignored for simplicity (0-100 scale)
             const d = dx*dx + dy*dy;
             if (d < minDist) {
                minDist = d;
                bestIdx = idx;
             }
         });
         
         if (p.clusterIdx !== bestIdx) {
            changes++;
            p.clusterIdx = bestIdx;
         }
      });
      
      logs.value.push(`Assignment Step: Reassigned ${changes} points.`);
      phase.value = 'Update';
   } else {
      // Update centroids to mean of assigned points
      const sums = centroids.value.map(() => ({ x: 0, y: 0, count: 0 }));
      
      points.value.forEach(p => {
         if (p.clusterIdx !== -1) {
            sums[p.clusterIdx].x += p.x;
            sums[p.clusterIdx].y += p.y;
            sums[p.clusterIdx].count++;
         }
      });
      
      let moved = false;
      centroids.value.forEach((c, i) => {
         if (sums[i].count > 0) {
            const newX = sums[i].x / sums[i].count;
            const newY = sums[i].y / sums[i].count;
            if (Math.abs(newX - c.x) > 0.1 || Math.abs(newY - c.y) > 0.1) moved = true;
            c.x = newX;
            c.y = newY;
         }
      });
      
      logs.value.push(`Update Step: Centroids moved to center of mass.`);
      phase.value = 'Assign';
      
      if (!moved) logs.value.push("Converged! Centroids didn't move significantly.");
   }
};

const reset = (newK: number) => {
   k.value = newK;
   centroids.value = [];
   points.value.forEach(p => p.clusterIdx = -1);
   phase.value = 'Assign';
   logs.value.push(`Switched to K=${newK}. Centroids cleared.`);
};

const clear = () => {
   points.value = [];
   centroids.value = [];
   phase.value = 'Assign';
   logs.value = ['Cleared board.'];
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

.label { font-weight: bold; font-size: 0.8rem; color: #64748b; }

.btn-group { display: flex; gap: 0.2rem; }
.btn-group button {
  border: 1px solid #cbd5e1;
  background: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
.btn-group button.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.action-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-left: 1rem;
}
.action-btn:hover:not(:disabled) { background: #7c3aed; }
.action-btn:disabled { opacity: 0.5; }

.reset-btn {
  background: transparent; border: none; font-size: 0.8rem; 
  text-decoration: underline; color: #94a3b8; cursor: pointer;
  margin-left: 0.5rem;
}

.visualization-container {
  height: 350px;
  background: #fafaf9;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.plot-area {
  width: 100%;
  max-width: 400px;
  height: 100%;
  border: 1px solid #d6d3d1;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  background: white;
}

.grid-bg {
  width: 100%; height: 100%;
  background-image: linear-gradient(#e7e5e4 1px, transparent 1px),
                    linear-gradient(90deg, #e7e5e4 1px, transparent 1px);
  background-size: 20px 20px;
  position: absolute;
  pointer-events: none;
}

.instruction-overlay {
  position: absolute;
  top: 50%; left: 50%; width: 100%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #a8a29e; font-weight: bold; pointer-events: none;
}

.data-point {
  width: 10px; height: 10px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: background-color 0.4s;
  border: 1px solid rgba(0,0,0,0.1);
}

.centroid {
  width: 20px; height: 20px;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center; justify-content: center;
  z-index: 10;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  border: 2px solid white;
  border-radius: 4px; /* Square-ish */
}

/* Colors */
.unassigned { background: #d6d3d1; }
.c0 { background: #ef4444; }
.c1 { background: #3b82f6; }
.c2 { background: #22c55e; }
.c3 { background: #eab308; }

.centroid.c0 { background: #ef4444; }
.centroid.c1 { background: #3b82f6; }
.centroid.c2 { background: #22c55e; }
.centroid.c3 { background: #eab308; }

.crosshair {
  width: 10px; height: 2px;
  background: white;
  position: absolute;
}
.crosshair::after {
  content: '';
  width: 2px; height: 10px;
  background: white;
  position: absolute;
  left: 4px; top: -4px;
}

.pop-enter-active { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  from { transform: translate(-50%, -50%) scale(0); }
  to { transform: translate(-50%, -50%) scale(1); }
}

.fade-move-enter-active, .fade-move-leave-active { transition: all 0.5s; }
.fade-move-enter-from, .fade-move-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }

.console {
  background: #0f172a;
  color: #e9d5ff;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 100px;
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
