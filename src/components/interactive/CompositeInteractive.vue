<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="info">
        Composite Pattern: Treating individual objects (Leaves) and compositions of objects (Composites) uniformly.
      </div>
      <div class="actions">
         <button @click="calculateSize" class="action-btn" :disabled="isAnimating">
           Calculate Size
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
      <div class="tree-root">
        <node-item :node="rootNode" :active-ids="activeIds" :results="results" />
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// -- Types --
interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number; // Only for files
  children?: FileSystemNode[]; // Only for folders
}

// -- Components --
// Recursive component for rendering the tree
import { defineComponent, h, PropType, computed } from 'vue';

const NodeItem: any = defineComponent({
  name: 'NodeItem',
  props: {
    node: {
      type: Object as PropType<FileSystemNode>,
      required: true
    },
    activeIds: {
      type: Set,
      required: true
    },
    results: {
      type: Object as PropType<Record<string, number>>,
      required: true
    }
  },
  setup(props) {
    const isActive = computed(() => props.activeIds.has(props.node.id));
    const resultSize = computed(() => props.results[props.node.id]);

    return () => {
      const { node } = props;
      const isFolder = node.type === 'folder';
      
      return h('div', { class: ['node-wrapper', { active: isActive.value }] }, [
        h('div', { class: 'node-content' }, [
          h('span', { class: 'icon' }, isFolder ? '📂' : '📄'),
          h('span', { class: 'name' }, node.name),
          h('span', { class: ['size-badge', { visible: resultSize.value !== undefined }] }, 
            resultSize.value !== undefined ? `${resultSize.value} KB` : (isFolder ? '' : `${node.size} KB`)
          )
        ]),
        isFolder && node.children ? h('div', { class: 'children' }, 
          node.children.map(child => h(NodeItem, { 
            node: child, 
            activeIds: props.activeIds,
            results: props.results
          }))
        ) : null
      ]);
    };
  }
});


// -- Data --
const rootNode = reactive<FileSystemNode>({
  id: 'root',
  name: 'Project Root',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        { id: 'f1', name: 'App.vue', type: 'file', size: 5 },
        { id: 'f2', name: 'main.ts', type: 'file', size: 2 },
        { 
          id: 'comps',
          name: 'components',
          type: 'folder',
          children: [
             { id: 'f3', name: 'Header.vue', type: 'file', size: 4 },
             { id: 'f4', name: 'Footer.vue', type: 'file', size: 3 }
          ]
        }
      ]
    },
    { id: 'f5', name: 'readme.md', type: 'file', size: 1 },
    { id: 'f6', name: 'package.json', type: 'file', size: 2 }
  ]
});

// -- State --
const logs = ref<string[]>(['Ready. Click Calculate Size to propagate operation.']);
const activeIds = ref<Set<string>>(new Set());
const results = ref<Record<string, number>>({});
const isAnimating = ref(false);

// -- Logic --
const calculateSize = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  activeIds.value.clear();
  results.value = {}; // Reset results
  logs.value.push('Calling getSize() on root...');

  const total = await processNode(rootNode);
  
  logs.value.push(`Total size calculated: ${total} KB`);
  isAnimating.value = false;
};

const processNode = async (node: FileSystemNode): Promise<number> => {
   // Visualize visiting
   activeIds.value.add(node.id);
   await delay(400);
   
   if (node.type === 'file') {
     logs.value.push(`File '${node.name}': returning directly (${node.size} KB).`);
     activeIds.value.delete(node.id);
     return node.size!;
   } else {
     logs.value.push(`Folder '${node.name}': recursively calling children...`);
     let sum = 0;
     if (node.children) {
       for (const child of node.children) {
          sum += await processNode(child);
       }
     }
     results.value[node.id] = sum;
     logs.value.push(`Folder '${node.name}': sum is ${sum} KB.`);
     activeIds.value.delete(node.id);
     return sum;
   }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const reset = () => {
  activeIds.value.clear();
  results.value = {};
  logs.value = ['Ready.'];
  isAnimating.value = false;
};

// -- Style --
// Note: recursive component styles are usually global or need keyframes here.
// But we can put them in scoped style, Vue handles deep nicely usually or passed classes.
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
  max-width: 60%;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #6366f1; /* Indigo */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #4f46e5; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  padding: 2rem;
  background: #eef2ff; /* Light Indigo */
  min-height: 300px;
}

.tree-root {
  font-family: 'Inter', system-ui, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

/* Deep selector for recursive children */
:deep(.node-wrapper) {
  margin: 0.2rem 0;
}

:deep(.node-content) {
  display: flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.node-wrapper.active > .node-content) {
  background: #c7d2fe; /* Active Highlight */
  color: #312e81;
  font-weight: bold;
}

:deep(.icon) { margin-right: 0.5rem; }

:deep(.children) {
  margin-left: 1.5rem;
  border-left: 1px solid #e2e8f0;
  padding-left: 0.5rem;
}

:deep(.size-badge) {
  margin-left: auto;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.75rem;
  padding: 0 4px;
  border-radius: 4px;
  opacity: 0.6;
}

:deep(.size-badge.visible) {
  opacity: 1;
  background: #34d399;
  color: #064e3b;
  font-weight: bold;
}

.console {
  background: #0f172a;
  color: #818cf8;
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
