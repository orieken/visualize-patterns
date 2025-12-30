<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Query:</label>
        <div class="query-inputs">
           <div class="field">
              <span>Mood:</span>
              <select v-model="query.mood">
                 <option value="happy">Happy 😊</option>
                 <option value="tired">Tired 😴</option>
                 <option value="angry">Angry 😠</option>
              </select>
           </div>
           <div class="field">
              <span>Weather:</span>
              <select v-model="query.weather">
                 <option value="sunny">Sunny ☀️</option>
                 <option value="rainy">Rainy 🌧️</option>
              </select>
           </div>
        </div>
      </div>
      <button @click="predict" class="action-btn" :disabled="isAnimating">Predict Activity</button>
    </div>

    <div class="visualization-container">
       <div class="tree-layout">
          <tree-node 
             :node="treeRoot" 
             :active-id="activateNodeId"
             :path-taken="pathTaken"
          />
       </div>

       <div class="result-display" v-if="prediction">
          Recommended: 
          <span class="pred-text">{{ prediction }}</span>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h, PropType } from 'vue';

// --- Types ---
interface Query {
  mood: 'happy' | 'tired' | 'angry';
  weather: 'sunny' | 'rainy';
}

interface Node {
  id: string;
  label: string;
  isLeaf: boolean;
  left?: Node;
  right?: Node;
  condition?: (q: Query) => boolean;
  value?: string; // leaf value
  question?: string; // internal node question
}

// --- Data ---
const query = ref<Query>({ mood: 'happy', weather: 'sunny' });
const activateNodeId = ref<string | null>(null);
const pathTaken = ref<Set<string>>(new Set());
const prediction = ref<string | null>(null);
const logs = ref<string[]>(['Ready. Adjust inputs and click Predict.']);
const isAnimating = ref(false);

const treeRoot: Node = {
  id: 'root',
  label: 'Root',
  isLeaf: false,
  question: 'Is Mood Tired?',
  condition: (q) => q.mood === 'tired',
  left: { // Yes (Tired)
     id: 'n-tired',
     isLeaf: true,
     label: 'Go to Sleep  🛌',
     value: 'Sleep',
  },
  right: { // No (Not Tired)
     id: 'n-active',
     label: 'Check Weather',
     isLeaf: false,
     question: 'Is it Sunny?',
     condition: (q) => q.weather === 'sunny',
     left: { // Yes (Sunny)
        id: 'n-sunny',
        isLeaf: true,
        label: 'Go for a Walk 🚶',
        value: 'Walk'
     },
     right: { // No (Rainy)
        id: 'n-rainy',
        isLeaf: false,
        label: 'Check Mood Again',
        question: 'Is Mood Angry?',
        condition: (q) => q.mood === 'angry',
        left: { // Yes (Angry + Rainy)
           id: 'n-angry',
           isLeaf: true,
           label: 'Punch a Pillow 🥊',
           value: 'Punch Pillow'
        },
        right: { // No (Happy + Rainy)
           id: 'n-happy-rain',
           isLeaf: true,
           label: 'Read a Book 📖',
           value: 'Read Book'
        }
     }
  }
};

// --- Recursive Component ---
const TreeNode: any = defineComponent({
  name: 'TreeNode',
  props: {
    node: { type: Object as PropType<Node>, required: true },
    activeId: { type: String, default: null },
    pathTaken: { type: Object as PropType<Set<string>>, required: true }
  },
  setup(props) {
    return () => {
      const { node, activeId, pathTaken } = props;
      const isActive = node.id === activeId;
      const onPath = pathTaken.has(node.id); // For highlighting traversal history
      
      const content = node.isLeaf 
        ? h('div', { class: ['node-card', 'leaf', { active: isActive, traveled: onPath }] }, node.label)
        : h('div', { class: ['node-card', 'internal', { active: isActive, traveled: onPath }] }, [
            h('div', { class: 'question' }, node.question),
            h('div', { class: 'branches' }, [
               h('span', { class: 'branch-label' }, 'Yes'),
               h('span', { class: 'branch-label' }, 'No')
            ])
          ]);

      const children = !node.isLeaf && node.left && node.right
        ? h('div', { class: 'children-container' }, [
            h('div', { class: 'child-branch left' }, [
               h(TreeNode, { node: node.left, activeId, pathTaken })
            ]),
            h('div', { class: 'child-branch right' }, [
               h(TreeNode, { node: node.right, activeId, pathTaken })
            ])
          ])
        : null;

      return h('div', { class: 'tree-node-wrapper' }, [content, children]);
    };
  }
});

// --- Logic ---
const predict = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  activateNodeId.value = null;
  pathTaken.value.clear();
  prediction.value = null;
  logs.value.push(`Decision Tree: Starting prediction for [Mood: ${query.value.mood}, Weather: ${query.value.weather}]`);
  
  let current: Node = treeRoot;
  
  while (current) {
     activateNodeId.value = current.id;
     pathTaken.value.add(current.id);
     
     if (current.isLeaf) {
        logs.value.push(`Reached Leaf: ${current.label}`);
        await delay(500);
        prediction.value = current.value!;
        break;
     }

     logs.value.push(`Question: ${current.question}`);
     await delay(800);
     
     if (current.condition && current.condition(query.value)) {
        logs.value.push(`Answer: YES. Going Left.`);
        current = current.left!;
     } else {
        logs.value.push(`Answer: NO. Going Right.`);
        current = current.right!;
     }
  }
  
  isAnimating.value = false;
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

.query-inputs {
  display: flex;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: #64748b;
}

select {
  padding: 0.3rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
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
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  padding: 2rem;
  background: #f5f3ff; /* Light violet */
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}

.tree-layout {
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.tree-node-wrapper) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.node-card) {
  padding: 0.6rem 1rem;
  background: white;
  border: 2px solid #ddd6fe;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.3s;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

:deep(.node-card.internal) {
  background: #fff;
}
:deep(.node-card.leaf) {
  background: #ede9fe; /* light purple */
  font-weight: bold;
  color: #5b21b6;
  border-color: #8b5cf6;
}

:deep(.node-card.active) {
  border-color: #f59e0b;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}
:deep(.node-card.traveled) {
  border-color: #f59e0b;
}

:deep(.question) {
  font-weight: bold;
  font-size: 0.85rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

:deep(.branches) {
  display: flex;
  justify-content: space-between;
  width: 120px;
  font-size: 0.7rem;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.2rem;
}

:deep(.children-container) {
  display: flex;
  gap: 2rem;
  position: relative;
}

/* Connecting Lines (Pseudo-elements) */
:deep(.children-container)::before {
  content: '';
  position: absolute;
  top: -2rem;
  left: 50%;
  width: 2px;
  height: 2rem;
  background: #cbd5e1;
}

:deep(.child-branch) {
  position: relative;
}

:deep(.child-branch)::before {
  content: '';
  position: absolute;
  top: -2rem;
  width: 50%;
  height: 2px;
  background: #cbd5e1;
}
:deep(.child-branch.left)::before { right: -2px; } /* Connect to center */
:deep(.child-branch.right)::before { left: 0; }

.result-display {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #334155;
  font-weight: bold;
  background: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pred-text { color: #8b5cf6; }

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.console {
  background: #0f172a;
  color: #c4b5fd;
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
