<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
         <label>K = {{ k }}</label>
         <input type="range" v-model.number="k" min="1" max="9" step="2" />
         
         <div class="legend">
            <span class="legend-item"><span class="dot class-a"></span> Type A</span>
            <span class="legend-item"><span class="dot class-b"></span> Type B</span>
         </div>
      </div>
      <button @click="reset" class="reset-btn">Reset</button>
    </div>

    <div class="visualization-container">
       <div class="canvas-area" @mousemove="onMouseMove" @mouseleave="hideQuery" @click="classifyQuery">
          <!-- Background Grid -->
          <div class="grid-lines"></div>

          <!-- Training Data -->
          <div 
             v-for="(p, i) in dataPoints" 
             :key="i"
             class="data-point"
             :class="p.type"
             :style="{ left: p.x + '%', top: p.y + '%' }"
          ></div>

          <!-- Query Point (Cursor Follower) -->
          <div 
             v-if="queryPoint"
             class="query-point"
             :style="{ left: queryPoint.x + '%', top: queryPoint.y + '%' }"
          >
             ?
             <!-- kNN Radius (Visual Approximation) -->
             <div class="radius-circle" :style="{ width: radiusSize + 'px', height: radiusSize + 'px' }"></div>
          </div>
          
          <!-- Neighbor Lines -->
          <svg class="lines-svg" v-if="queryPoint">
             <line 
                v-for="(n, i) in neighbors" 
                :key="'link'+i"
                :x1="queryPoint.x + '%'" 
                :y1="queryPoint.y + '%'" 
                :x2="n.point.x + '%'" 
                :y2="n.point.y + '%'" 
                stroke="#94a3b8" 
                stroke-width="1"
                stroke-dasharray="4"
             />
          </svg>
       </div>
       
       <div class="prediction-panel" v-if="queryPoint">
          <div class="pred-title">Prediction (k={{ k }})</div>
          <div class="pred-result" :class="prediction">
             {{ prediction === 'class-a' ? 'Type A' : 'Type B' }}
          </div>
          <div class="vote-counts">
             votes: <span class="cA">{{ voteCounts.a }}</span> vs <span class="cB">{{ voteCounts.b }}</span>
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

interface Point {
  x: number;
  y: number;
  type: 'class-a' | 'class-b';
}

interface Neighbor {
  point: Point;
  dist: number;
}

const k = ref(3);
const logs = ref<string[]>(['Ready. Move mouse to see classification. Click to add the point.']);

// Initial Random Data
const generateData = (): Point[] => {
   const pts: Point[] = [];
   // Cluster A (Top Left-ish)
   for(let i=0; i<8; i++) pts.push({ 
     x: 20 + Math.random()*30, 
     y: 20 + Math.random()*30, 
     type: 'class-a' 
   });
   // Cluster B (Bottom Right-ish)
   for(let i=0; i<8; i++) pts.push({ 
     x: 50 + Math.random()*30, 
     y: 50 + Math.random()*30, 
     type: 'class-b' 
   });
   return pts;
};

const dataPoints = ref<Point[]>(generateData());
const queryPoint = ref<{x: number, y: number} | null>(null);

const neighbors = computed(() => {
   if (!queryPoint.value) return [];
   
   // Calculate distances
   const q = queryPoint.value;
   const dists = dataPoints.value.map(p => {
     const dx = p.x - q.x;
     // Aspect ratio correction approximation (assuming square)
     const dy = p.y - q.y; 
     return { point: p, dist: Math.sqrt(dx*dx + dy*dy) };
   });
   
   // Sort and slice k
   return dists.sort((a, b) => a.dist - b.dist).slice(0, k.value);
});

// Calculate radius of furthest k neighbor (for visual circle)
// Note: This pixel conversion is approximate since we use % coordinates
const radiusSize = computed(() => {
   if (neighbors.value.length === 0) return 0;
   const furthrest = neighbors.value[neighbors.value.length - 1];
   // Crude conversion % to px assuming ~300px container width
   return furthrest.dist * 3 * 2; // *3 for px scale, *2 for diameter
});

const voteCounts = computed(() => {
   const counts = { a: 0, b: 0 };
   for (const n of neighbors.value) {
      if (n.point.type === 'class-a') counts.a++;
      else counts.b++;
   }
   return counts;
});

const prediction = computed(() => {
   return voteCounts.value.a > voteCounts.value.b ? 'class-a' : 'class-b';
});

const onMouseMove = (e: MouseEvent) => {
   const el = e.currentTarget as HTMLElement;
   const rect = el.getBoundingClientRect();
   const x = ((e.clientX - rect.left) / rect.width) * 100;
   const y = ((e.clientY - rect.top) / rect.height) * 100;
   queryPoint.value = { x, y };
};

const hideQuery = () => {
   queryPoint.value = null;
};

const classifyQuery = () => {
   if (!queryPoint.value) return;
   
   const newPoint: Point = {
      x: queryPoint.value.x,
      y: queryPoint.value.y,
      type: prediction.value
   };
   
   dataPoints.value.push(newPoint);
   logs.value.push(`Added new point classified as ${prediction.value === 'class-a' ? 'Type A' : 'Type B'}`);
};

const reset = () => {
   dataPoints.value = generateData();
   logs.value = ['Reset data points.'];
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

.panel label { font-weight: bold; color: #64748b; }

.legend {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 1rem;
}

.legend-item { display: flex; align-items: center; gap: 0.3rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.class-a { background: #3b82f6; }
.dot.class-b { background: #f97316; }

.reset-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  text-decoration: underline;
}

.visualization-container {
  height: 350px;
  background: #fdfdfd;
  padding: 1rem;
  display: flex;
  justify-content: center;
  position: relative;
}

.canvas-area {
  width: 100%;
  max-width: 400px;
  height: 100%;
  border: 1px solid #cbd5e1;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(#f1f5f9 1px, transparent 1px),
                    linear-gradient(90deg, #f1f5f9 1px, transparent 1px);
  background-size: 20px 20px;
  cursor: crosshair;
}

.data-point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.data-point.class-a { background: #3b82f6; }
.data-point.class-b { background: #f97316; }

.query-point {
  width: 20px;
  height: 20px;
  background: #1e293b;
  color: white;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex; /* Flex center ? text */
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.2);
}

.radius-circle {
  position: absolute;
  border: 1px dashed #94a3b8;
  border-radius: 50%;
  opacity: 0.5;
  transform: translate(0, 0); /* Centered by flex on parent actually? No, absolute in flex parent */
  /* Wait, parent is flex centered. So standard pos is center. */
  pointer-events: none;
}

.lines-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 1;
}

.prediction-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 0.8rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  width: 140px;
  text-align: center;
}

.pred-title { font-size: 0.7rem; color: #94a3b8; font-weight: bold; margin-bottom: 0.4rem; }
.pred-result { font-weight: 800; font-size: 1.1rem; margin-bottom: 0.2rem; }
.pred-result.class-a { color: #3b82f6; }
.pred-result.class-b { color: #f97316; }

.vote-counts { font-size: 0.75rem; color: #64748b; }
.vote-counts .cA { color: #3b82f6; font-weight: bold; }
.vote-counts .cB { color: #f97316; font-weight: bold; }

.console {
  background: #0f172a;
  color: #a5b4fc;
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
