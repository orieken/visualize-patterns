<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>View:</label>
        <div class="btn-group">
           <button @click="mode = '2d'" :class="{active: mode === '2d'}">2D Cloud</button>
           <button @click="mode = 'projected'" :class="{active: mode === 'projected'}" :disabled="points.length < 2">
             Project (1D)
           </button>
        </div>
      </div>
      <div>
         <button @click="reset" class="reset-btn">Reset</button>
         <button @click="addRandomData" class="action-btn" :disabled="isAnimating">
            Change Dataset
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="plot-area">
          <!-- Grid -->
          <div class="grid-bg"></div>
          
          <!-- Axis Lines -->
          <div class="axis x-axis"></div>
          <div class="axis y-axis"></div>

          <!-- PC1 Line -->
          <svg class="pc-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" v-if="points.length >= 2">
             <!-- The Principal Component Line (Infinite line through mean with angle) -->
             <line 
                :x1="pcLine.x1" :y1="pcLine.y1" 
                :x2="pcLine.x2" :y2="pcLine.y2" 
                stroke="#a855f7" 
                stroke-width="0.8" 
                stroke-dasharray="2"
             />
             <!-- Mean Point -->
             <circle :cx="mean.x" :cy="100 - mean.y" r="1.5" fill="#a855f7" />
          </svg>

          <!-- Points -->
          <transition-group name="data-move">
             <div 
                v-for="(p, i) in displayedPoints" 
                :key="p.id" 
                class="data-point"
                :style="{ left: p.x + '%', top: (100 - p.y) + '%' }"
             ></div>
          </transition-group>
       </div>
       
       <div class="info-tag" v-if="points.length >= 2">
          PC1 Variance Explained: <strong>{{ varianceExplained }}%</strong>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Point {
  id: number;
  x: number;
  y: number;
}

const mode = ref<'2d' | 'projected'>('2d');
const points = ref<Point[]>([]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. PCA finds the "best" angle to view the data.']);

// Initial Data Generation (Correlated)
const generateData = () => {
   const pts: Point[] = [];
   const cx = 50; 
   const cy = 50; 
   
   // Create an oval shape rotated at some random angle
   const angle = Math.random() * Math.PI;
   const spreadX = 25 + Math.random() * 15;
   const spreadY = 5 + Math.random() * 5; // Narrower for clear PC1
   
   for (let i = 0; i < 20; i++) {
      // Random point in unit circle
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 2;
      
      // 1. Scale relative to the unrotated frame
      // spreadX is the major axis, spreadY is the minor axis
      const sx = u * spreadX;
      const sy = v * spreadY;

      // 2. Rotate the scaled point
      const xRot = sx * Math.cos(angle) - sy * Math.sin(angle);
      const yRot = sx * Math.sin(angle) + sy * Math.cos(angle);

      pts.push({
         id: i,
         // 3. Translate to center
         x: cx + xRot,
         y: cy + yRot
      });
   }
   return pts;
};

points.value = generateData();

const addRandomData = () => {
   mode.value = '2d';
   points.value = generateData();
   logs.value.push("Generated new random dataset.");
};

const mean = computed(() => {
   if (points.value.length === 0) return { x: 50, y: 50 };
   const sumX = points.value.reduce((s, p) => s + p.x, 0);
   const sumY = points.value.reduce((s, p) => s + p.y, 0);
   return { x: sumX / points.value.length, y: sumY / points.value.length };
});

const pcResults = computed(() => {
   if (points.value.length < 2) return { angle: 0, varianceRatio: 0 };
   
   // 1. Center data
   const centered = points.value.map(p => ({ x: p.x - mean.value.x, y: p.y - mean.value.y }));
   
   // 2. Compute Covariance Matrix 2x2
   // Cov(X,X), Cov(X,Y)
   // Cov(Y,X), Cov(Y,Y)
   let xx = 0;
   let xy = 0;
   let yy = 0;
   const n = centered.length;
   
   centered.forEach(p => {
      xx += p.x * p.x;
      xy += p.x * p.y;
      yy += p.y * p.y;
   });
   
   xx /= (n - 1);
   xy /= (n - 1);
   yy /= (n - 1);
   
   // 3. Eigenvalues/vectors for symmetric 2x2 matrix
   // trace = xx + yy, det = xx*yy - xy*xy
   // lambda = (trace +/- sqrt(trace^2 - 4*det)) / 2
   const trace = xx + yy;
   const det = xx * yy - xy * xy;
   const lambda1 = (trace + Math.sqrt(trace * trace - 4 * det)) / 2;
   const lambda2 = (trace - Math.sqrt(trace * trace - 4 * det)) / 2;
   
   // Eigenvector for lambda1 (Vector [1, u] or [v, 1])
   // (xx - lambda1) * vx + xy * vy = 0
   // xy * vx + (yy - lambda1) * vy = 0
   // if xy != 0, vx = 1, vy = -(xx - lambda1) / xy
   
   let angle = 0;
   if (Math.abs(xy) > 1e-5) {
      const vx = 1;
      const vy = (lambda1 - xx) / xy;
      angle = Math.atan2(vy, vx);
   } else {
      // Aligned with axis
      angle = xx > yy ? 0 : Math.PI / 2;
   }
   
   const varianceRatio = lambda1 / (lambda1 + lambda2);
   return { angle, varianceRatio };
});

const varianceExplained = computed(() => {
   return (pcResults.value.varianceRatio * 100).toFixed(1);
});

const pcLine = computed(() => {
   const { angle } = pcResults.value;
   const mx = mean.value.x;
   const my = mean.value.y; // 0-100 logic (y is bottom-up here, but SVG needs top-down)
   
   // Actually SVG is Top-Down (0 is top). My mean.y is Bottom-Up.
   // Let's converting mean.y to SVG Y
   const svgMy = 100 - my;
   
   // Slope in SVG coords
   // SVG Y increases downwards.
   // Normal math: dy/dx = tan(theta).
   // SVG math: dy/dx = -tan(theta) because Y is flipped.
   const length = 100;
   const dx = Math.cos(angle) * length;
   const dy = -Math.sin(angle) * length; 
   
   return {
      x1: mx - dx,
      y1: svgMy - dy,
      x2: mx + dx,
      y2: svgMy + dy
   };
});

const displayedPoints = computed(() => {
   if (mode.value === '2d') return points.value;
   
   // Project points onto PC1 line
   // P_proj = Mean + ( (P - Mean) dot UnitVec ) * UnitVec
   const { angle } = pcResults.value;
   const mx = mean.value.x;
   const my = mean.value.y;
   const ux = Math.cos(angle);
   const uy = Math.sin(angle); // Normal math usage
   
   return points.value.map(p => {
      const pdx = p.x - mx;
      const pdy = p.y - my;
      const dot = pdx * ux + pdy * uy;
      
      return {
         id: p.id,
         x: mx + dot * ux,
         y: my + dot * uy
      };
   });
});

const reset = () => {
   mode.value = '2d';
   logs.value = ['Reset view.'];
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
  background: #a855f7;
  color: white;
  border-color: #9333ea;
}

.action-btn {
  background: #a855f7;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-left: 1rem;
}
.action-btn:hover:not(:disabled) { background: #9333ea; }

.reset-btn {
  background: transparent; border: none; font-size: 0.8rem; 
  text-decoration: underline; color: #94a3b8; cursor: pointer;
}

.visualization-container {
  height: 350px;
  background: #fafafa;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.plot-area {
  width: 100%;
  max-width: 400px;
  height: 100%;
  border: 1px solid #d4d4d8;
  position: relative;
  overflow: hidden;
  background: white;
}

.grid-bg {
  width: 100%; height: 100%;
  background-image: linear-gradient(#f4f4f5 1px, transparent 1px),
                    linear-gradient(90deg, #f4f4f5 1px, transparent 1px);
  background-size: 20px 20px;
  position: absolute;
  pointer-events: none;
}

.axis {
  position: absolute;
  background: #e4e4e7;
}
.x-axis { width: 100%; height: 1px; top: 50%; left: 0; }
.y-axis { width: 1px; height: 100%; left: 50%; top: 0; }

.pc-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.data-point {
  width: 8px; height: 8px;
  background: #a855f7;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  opacity: 0.8;
}

.data-move-enter-active, .data-move-leave-active { transition: all 0.5s; }
.data-move-enter-from { opacity: 0; transform: scale(0); }

.info-tag {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e9d5ff;
  font-size: 0.75rem;
  color: #7e22ce;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.console {
  background: #0f172a;
  color: #d8b4fe;
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
