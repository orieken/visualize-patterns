<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start Union-Find' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="sets-area">
        <transition-group name="node-move">
          <div 
            v-for="set in sets" 
            :key="set.id"
            class="set-group"
            :class="{ active: activeSetId === set.id }"
            :style="{ left: set.x + '%', top: set.y + '%' }"
          >
            <!-- Draw parent pointer/link -->
            <div v-if="set.parentId !== set.id" class="link-line"></div>
            
            <div 
              class="uf-node"
              :class="{ 
                root: set.parentId === set.id,
                child: set.parentId !== set.id
              }"
              :style="{ backgroundColor: set.color }"
            >
              {{ set.id }}
              <span class="rank-badge" v-if="set.parentId === set.id">r={{ set.rank }}</span>
            </div>
            
            <!-- Children rendered recursively or just flat list if simple? 
                 Visualizing tree structure with CSS only is hard for dynamic trees.
                 Let's keep it simple: Nodes move to group under their parent visually.
             -->
          </div>
        </transition-group>
        
         <!-- SVG overlay for connectors might be needed if using absolute positions -->
         <svg class="connections" width="100%" height="100%">
            <line v-for="link in links" :key="link.from + link.to"
              :x1="getNodePos(link.from).x" :y1="getNodePos(link.from).y"
              :x2="getNodePos(link.to).x" :y2="getNodePos(link.to).y"
              stroke="#94a3b8" stroke-width="2" stroke-dasharray="4"
            />
         </svg>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface UFNode {
  id: string;
  parentId: string;
  rank: number;
  x: number;
  y: number;
  color: string;
}

const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#e879f9'];
const initialNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Initial grid layout
const createNodes = (): UFNode[] => initialNodes.map((id, i) => ({
  id,
  parentId: id,
  rank: 0,
  x: 10 + (i % 4) * 25,
  y: 20 + Math.floor(i / 4) * 40,
  color: colors[i]
}));

const sets = ref<UFNode[]>(createNodes());
const logs = ref<string[]>(['Ready. 8 Disjoint Sets.']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
const activeSetId = ref<string|null>(null);

let autoPlayInterval: number | null = null;
let stepIdx = 0;

// Operations sequence
const operations = [
  { type: 'UNION', a: 'A', b: 'B' },
  { type: 'UNION', a: 'C', b: 'D' },
  { type: 'UNION', a: 'A', b: 'C' }, // Merge two trees of size 2
  { type: 'UNION', a: 'E', b: 'F' },
  { type: 'UNION', a: 'G', b: 'H' },
  { type: 'UNION', a: 'E', b: 'G' },
  { type: 'UNION', a: 'A', b: 'E' }, // Merge two trees of size 4
  { type: 'FIND', a: 'H' }           // Show path compression (conceptually)
];

const links = computed(() => {
  return sets.value
    .filter(n => n.parentId !== n.id)
    .map(n => ({ from: n.id, to: n.parentId }));
});

const getNodePos = (id: string) => {
  const node = sets.value.find(n => n.id === id);
  // Return percentage strings directly? wait SVG needs numbers usually or use % if supported. 
  // SVG lines with % work in some browsers but safer to use simple coordinate mapping if fixed size.
  // Actually usually easier to assume 100x100 coord system or similar.
  // Let's rely on CSS left/top % works for div, but for SVG lines... 
  // We can use a simple helper transforming % to assumed width 100/100
  // But wait, our container size varies.
  // Visualization trick: Just draw lines to center of where nodes are.
  return node ? { x: `${node.x}%`, y: `${node.y}%` } : { x: '0', y: '0' };
};

const findRoot = (id: string): string => {
  let node = sets.value.find(n => n.id === id)!;
  while (node.parentId !== node.id) {
    node = sets.value.find(n => n.id === node.parentId)!;
  }
  return node.id;
};

// Update visual position recursively to group under root
const updatePositions = () => {
    // Basic force-directed-ish or just hierarchical layout logic?
    // Simple tree layout:
    // Roots are spaced out. Children valid below them.
    // Let's re-calculate X/Y for everyone based on current structure.
    
    const roots = sets.value.filter(n => n.parentId === n.id);
    const widthPerRoot = 100 / roots.length;
    
    roots.forEach((root, i) => {
        // Place root
        root.x = (i * widthPerRoot) + (widthPerRoot / 2);
        root.y = 20;

        // Find direct children
        const children = sets.value.filter(n => n.parentId === root.id && n.id !== root.id);
        // Simple 2-level depth visual for now, handling deep trees visually is hard without d3
        if (children.length > 0) {
            const widthPerChild = widthPerRoot / children.length;
            children.forEach((child, j) => {
                child.x = (i * widthPerRoot) + (j * widthPerChild) + (widthPerChild/2);
                child.y = 50;
                
                // Grandchildren
                const grandChildren = sets.value.filter(n => n.parentId === child.id);
                if (grandChildren.length > 0) {
                    const widthPerGrand = widthPerChild / grandChildren.length;
                    grandChildren.forEach((gc, k) => {
                         gc.x = child.x - (widthPerChild/4) + (k * widthPerGrand); // messy math
                         // Let's just stack them? 
                         gc.x = child.x + (k%2 === 0 ? -5 : 5);
                         gc.y = 80;
                    });
                }
            });
        }
    });
};


const reset = () => {
  sets.value = createNodes();
  logs.value = ['Ready. 8 Disjoint Sets.'];
  isStarted.value = false;
  isFinished.value = false;
  activeSetId.value = null;
  stepIdx = 0;
  stopAuto();
};

const stopAuto = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isAutoPlaying.value = false;
  }
};

const toggleAuto = () => {
  if (isAutoPlaying.value) {
    stopAuto();
  } else {
    isAutoPlaying.value = true;
    nextStep();
    autoPlayInterval = setInterval(() => {
      if (isFinished.value) stopAuto();
      else nextStep();
    }, 2000) as unknown as number;
  }
};

const nextStep = () => {
  if (isFinished.value) return;
  
  if (!isStarted.value) {
      isStarted.value = true;
  }

  if (stepIdx >= operations.length) {
      logs.value.push('All operations complete.');
      isFinished.value = true;
      return;
  }

  const op = operations[stepIdx];
  stepIdx++;

  if (op.type === 'UNION') {
      if (!op.a || !op.b) return;
      const rootA = findRoot(op.a);
      const rootB = findRoot(op.b);
      
      logs.value.push(`Union(${op.a}, ${op.b})... Roots are ${rootA} & ${rootB}.`);
      
      if (rootA !== rootB) {
          const nodeA = sets.value.find(n => n.id === rootA)!;
          const nodeB = sets.value.find(n => n.id === rootB)!;
          
          // Union by rank
          if (nodeA.rank < nodeB.rank) {
              nodeA.parentId = nodeB.id;
              nodeA.color = nodeB.color; // Inherit color
              logs.value.push(`${rootA} (rank ${nodeA.rank}) becomes child of ${rootB} (rank ${nodeB.rank}).`);
          } else if (nodeA.rank > nodeB.rank) {
              nodeB.parentId = nodeA.id;
              nodeB.color = nodeA.color;
              logs.value.push(`${rootB} (rank ${nodeB.rank}) becomes child of ${rootA} (rank ${nodeA.rank}).`);
          } else {
              nodeB.parentId = nodeA.id;
              nodeA.rank++;
              nodeB.color = nodeA.color;
              logs.value.push(`Ranks equal. ${rootB} links to ${rootA}. ${rootA} rank -> ${nodeA.rank}.`);
          }
           // Recruit color recursively?
           // Ideally all children should update color to show set membership.
           // Doing visually:
           sets.value.forEach(s => {
               if (findRoot(s.id) === findRoot(rootA)) { // New common root
                   const r = sets.value.find(r => r.id === findRoot(rootA))!;
                   s.color = r.color;
               }
           });
           
           updatePositions();
      } else {
          logs.value.push(`Already in same set (Root ${rootA}). No op.`);
      }
  } else if (op.type === 'FIND') {
      const root = findRoot(op.a);
      logs.value.push(`Find(${op.a}) -> Root is ${root}.`);
      // Could illustrate path compression here by reparenting, but let's keep it simple for now.
  }
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
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.action-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #0284c7; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #0ea5e9;
  border: 1px solid #0ea5e9;
}

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-left: auto;
}

.visualization-container {
  position: relative;
  height: 300px;
  background: #f1f5f9;
  overflow: hidden;
}

.sets-area {
  position: relative;
  width: 100%;
  height: 100%;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.set-group {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
}

.uf-node {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  border: 3px solid white;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.uf-node.root {
  width: 50px;
  height: 50px;
  border-color: #0f172a;
}

.rank-badge {
  position: absolute;
  top: -15px;
  background: #0f172a;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.console {
  background: #0f172a;
  color: #a5b4fc;
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
</style>
