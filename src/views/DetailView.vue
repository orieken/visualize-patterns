<template>
  <main class="detail">
    <!-- Breadcrumb optional, global nav handles 'Back' now -->
    
    <section v-if="item" class="detail-card">
      <p class="eyebrow">{{ item.domain }}</p>
      <div class="header-row">
        <h1>{{ item.name }}</h1>
        <button 
            class="mastery-btn" 
            :class="{ active: isMastered(item.slug!) }"
            @click="toggleMastery(item.slug!)"
        >
            {{ isMastered(item.slug!) ? '🏆 Mastered' : '⚪ Mark as Mastered' }}
        </button>
      </div>
      <p class="meta" v-if="item.complexity">Complexity: {{ item.complexity }}</p>
      <p class="meta" v-else-if="item.type">Type: {{ item.type }}</p>
      <p class="meta" v-else>Category: {{ item.category || 'Pattern' }}</p>
      <p class="description">{{ item.idea || item.intent }}</p>

      <div v-if="item.explanation" class="explanation">
        <h3>Plain English Explanation</h3>
        <p class="explanation-text">{{ item.explanation }}</p>
      </div>

      <div class="tabs">
        <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'viz' }"
            @click="activeTab = 'viz'"
        >
            👁️ Visualization
        </button>
        <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'code' }"
            @click="activeTab = 'code'"
        >
            👨‍💻 Code Playground
        </button>
      </div>

      <div v-show="activeTab === 'viz'" class="tab-content viz-pane">
        <VisualizationCanvas v-if="item.visualization" :visualization="item.visualization" />
        <div v-else class="pending">
            <div class="pending-icon">🚧</div>
            <p>Visualization pending — marked on the checklist.</p>
        </div>
      </div>

      <div v-show="activeTab === 'code'" class="tab-content code-pane">
        <div class="editor-toolbar">
            <span>TypeScript Sandbox</span>
            <button class="run-btn" @click="handleRun" :disabled="isRunning">
                {{ isRunning ? 'Running...' : '▶ Run Code' }}
            </button>
        </div>
        <div class="split-view">
             <CodeEditor v-model="userCode" language="typescript" theme="vs-dark" />
             <div class="console-output">
                <div class="console-header">Output</div>
                <div v-if="output.length === 0" class="placeholder">Run to see output...</div>
                <div v-for="(line, i) in output" :key="i" class="log-line">{{ line }}</div>
             </div>
        </div>
      </div>
    </section>

    <section v-else class="detail-card">
      <h1>Not found</h1>
      <p>We couldn't locate that visualization. Choose another item from the home view.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import VisualizationCanvas from '../components/VisualizationCanvas.vue';
import CodeEditor from '../components/CodeEditor.vue';
import { useCodeRunner } from '../composables/useCodeRunner';
import { useProgress } from '../composables/useProgress';
import type { CatalogItem } from '../types/catalog';
import { allItems } from '../assets/data/catalog';

const route = useRoute();
const activeTab = ref<'viz' | 'code'>('viz');
const { isMastered, toggleMastery } = useProgress();

// Reset tab when navigating to a new item
watch(() => route.params.slug, () => {
  activeTab.value = 'viz';
});

const slugParam = computed(() => {
  const param = route.params.slug;
  return typeof param === 'string' ? param : Array.isArray(param) ? param[0] : undefined;
});

const item = computed<CatalogItem | undefined>(() =>
  allItems.find(entry => entry.slug === slugParam.value)
);

// Starter code generator
const starterCode = computed(() => {
  if (!item.value) return '';
  const name = item.value.name.replace(/\s+/g, '');
  return `/**
 * ${item.value.name} Playground
 * 
 * Try implementing or experimenting with this pattern/algorithm!
 */

class ${name} {
    execute() {
        console.log("Hello from ${item.value.name}!");
    }
}

const demo = new ${name}();
demo.execute();
`;
});

const userCode = ref('');

// Init user code when starter code changes
watch(starterCode, (newCode) => {
  userCode.value = newCode;
}, { immediate: true });

const { runCode, output, isRunning } = useCodeRunner();

const handleRun = () => {
  runCode(userCode.value);
};
</script>

<style scoped>
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.header-row h1 {
    margin: 0;
}

.mastery-btn {
    background: transparent;
    border: 2px solid var(--card-border);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-muted);
}

.mastery-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.mastery-btn.active {
    background: #22c55e;
    border-color: #22c55e;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3);
}

.tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--card-border);
}

.tab-btn {
    background: transparent;
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
}

.tab-btn:hover {
    color: var(--primary);
}

.tab-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
}

.tab-content {
    animation: fadeIn 0.3s ease;
}

/* Visualization Pane Styles */
.pending {
    text-align: center;
    padding: 3rem;
    background: rgba(0,0,0,0.03);
    border-radius: 8px;
    border: 1px dashed var(--text-muted);
}
.pending-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* Code Pane Styles */
.editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
}

.split-view {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    height: 500px;
    border: 1px solid var(--card-border);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
}

.console-output {
    background: #1e1e1e;
    color: #efefef;
    padding: 1rem;
    font-family: monospace;
    overflow-y: auto;
    border-left: 1px solid #333;
}

.console-header {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
}

.run-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.25rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.run-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.log-line {
    margin-bottom: 0.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.placeholder {
    color: rgba(255,255,255,0.2);
    font-style: italic;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
