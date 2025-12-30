<template>
  <div class="interactive-demo">
    <div class="controls">
      <button @click="nextStep" class="action-btn" :disabled="isFinished">
        {{ isStarted ? 'Next Step' : 'Start Merge Sort' }}
      </button>
      <button @click="toggleAuto" class="action-btn secondary">
        {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>

    <div class="visualization-container">
      <div class="tree-area">
        <transition-group name="fade">
          <div 
            v-for="node in activeNodes" 
            :key="node.id"
            class="tree-node"
            :class="{ 
              'sorted': node.status === 'sorted',
              'merging': node.status === 'merging'
            }"
            :style="{ left: node.x + '%', top: node.y + '%' }"
          >
            <div class="array-box">
              <span v-for="(val, i) in node.values" :key="i" class="val">
                {{ val }}
              </span>
            </div>
            <!-- Connector to parent would be nice but CSS lines are tricky without SVG. Skipping for now. -->
          </div>
        </transition-group>
        
        <!-- SVG lines for structure - Optional/Advanced, let's keep it simple with just nodes first -->
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface TreeNode {
  id: string;
  values: number[];
  x: number;
  y: number;
  status: 'pending' | 'merging' | 'sorted';
  level: number;
  parentId?: string;
}

const initialArray = [6, 3, 8, 5]; // Smaller array (4 items) to fit well
// 4 items ->
// L0: [6,3,8,5] (1 node)
// L1: [6,3] [8,5] (2 nodes)
// L2: [6] [3] [8] [5] (4 nodes)

// Pre-define all potential nodes
const allNodes: Record<string, TreeNode> = {
  'root': { id: 'root', values: [6, 3, 8, 5], x: 50, y: 15, status: 'pending', level: 0 },
  'L':    { id: 'L',    values: [6, 3],       x: 30, y: 45, status: 'pending', level: 1, parentId: 'root' },
  'R':    { id: 'R',    values: [8, 5],       x: 70, y: 45, status: 'pending', level: 1, parentId: 'root' },
  'LL':   { id: 'LL',   values: [6],          x: 20, y: 75, status: 'pending', level: 2, parentId: 'L' },
  'LR':   { id: 'LR',   values: [3],          x: 40, y: 75, status: 'pending', level: 2, parentId: 'L' },
  'RL':   { id: 'RL',   values: [8],          x: 60, y: 75, status: 'pending', level: 2, parentId: 'R' },
  'RR':   { id: 'RR',   values: [5],          x: 80, y: 75, status: 'pending', level: 2, parentId: 'R' },
};

// Simulation Steps
// 1. Show Root.
// 2. Show L, R. (Hide Root contents visually? Or just show underneath? Let's keep them).
// 3. Show LL, LR, RL, RR.
// 4. Mark LL, LR as Sorted (trivial).
// 5. Merge LL+LR -> L. Update L values to [3, 6]. Mark L Sorted.
// 6. Mark RL, RR Sorted.
// 7. Merge RL+RR -> R. Update R values to [5, 8]. Mark R Sorted.
// 8. Merge L+R -> Root. Update Root to [3, 5, 6, 8]. Mark Root Sorted. 

const activeNodes = ref<TreeNode[]>([]);
const logs = ref<string[]>(['Ready. Array: [6, 3, 8, 5]']);
const isStarted = ref(false);
const isFinished = ref(false);
const isAutoPlaying = ref(false);
let stepIndex = 0;
let autoPlayInterval: number | null = null;

const reset = () => {
  activeNodes.value = [];
  logs.value = ['Ready. Array: [6, 3, 8, 5]'];
  isStarted.value = false;
  isFinished.value = false;
  stepIndex = 0;
  // Reset values in allNodes just in case (though we hardcoded them initially)
  allNodes['root'].values = [6, 3, 8, 5];
  allNodes['L'].values = [6, 3];
  allNodes['R'].values = [8, 5];
  Object.values(allNodes).forEach(n => n.status = 'pending');
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
    }, 1500) as unknown as number;
  }
};

const updateNode = (id: string, updates: Partial<TreeNode>) => {
  const node = activeNodes.value.find(n => n.id === id);
  if (node) {
    Object.assign(node, updates);
  } else if (allNodes[id]) {
    // If not active yet but we want to add or update
    Object.assign(allNodes[id], updates);
  }
};

const addNode = (id: string) => {
  activeNodes.value.push({ ...allNodes[id] });
};

const nextStep = () => {
  if (isFinished.value) return;

  // Hardcoded sort steps for [6,3,8,5]
  switch (stepIndex) {
    case 0:
      isStarted.value = true;
      addNode('root');
      logs.value.push('Start: Initial Array.');
      break;
    case 1:
      logs.value.push('Split: Divide into [6, 3] and [8, 5].');
      addNode('L');
      addNode('R');
      updateNode('root', { values: [] }); // Clear parent temporarily to show flow? Or keep? clearing makes focus easier
      break;
    case 2:
      logs.value.push('Split: Divide left side into [6] and [3].');
      addNode('LL');
      addNode('LR');
      updateNode('L', { values: [] });
      break;
    case 3:
      logs.value.push('Base case: Single items [6] and [3] are sorted.');
      updateNode('LL', { status: 'sorted' });
      updateNode('LR', { status: 'sorted' });
      break;
    case 4:
      logs.value.push('Merge: [6] and [3] -> [3, 6].');
      updateNode('L', { values: [3, 6], status: 'sorted' });
      // Remove children to clean up? Or keep? Let's remove to show "climbing up"
      activeNodes.value = activeNodes.value.filter(n => n.id !== 'LL' && n.id !== 'LR');
      break;
    case 5:
      logs.value.push('Split: Divide right side into [8] and [5].');
      addNode('RL');
      addNode('RR');
      updateNode('R', { values: [] });
      break;
    case 6:
      logs.value.push('Base case: Single items [8] and [5] are sorted.');
      updateNode('RL', { status: 'sorted' });
      updateNode('RR', { status: 'sorted' });
      break;
    case 7:
      logs.value.push('Merge: [8] and [5] -> [5, 8].');
      updateNode('R', { values: [5, 8], status: 'sorted' });
      activeNodes.value = activeNodes.value.filter(n => n.id !== 'RL' && n.id !== 'RR');
      break;
    case 8:
      logs.value.push('Merge final: [3, 6] and [5, 8] -> [3, 5, 6, 8].');
      updateNode('root', { values: [3, 5, 6, 8], status: 'sorted' });
      activeNodes.value = activeNodes.value.filter(n => n.id !== 'L' && n.id !== 'R');
      isFinished.value = true;
      logs.value.push('Sort Complete.');
      break;
  }
  stepIndex++;
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
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #4f46e5; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: #fff;
  color: #6366f1;
  border: 1px solid #6366f1;
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
  display: flex;
  justify-content: center;
  padding: 1rem;
  height: 250px;
  background: #f0fdfa; /* Light teal bg */
}

.tree-area {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 100%;
}

.tree-node {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.array-box {
  display: flex;
  background: white;
  border: 2px solid #94a3b8;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.val {
  padding: 0.4rem 0.6rem;
  border-right: 1px solid #e2e8f0;
  font-family: monospace;
  font-weight: 700;
  color: #334155;
  min-width: 24px;
  text-align: center;
}

.val:last-child {
  border-right: none;
}

.tree-node.sorted .array-box {
  border-color: #10b981;
  background: #ecfdf5;
}

.tree-node.sorted .val {
  color: #047857;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -60%);
}
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}
</style>
