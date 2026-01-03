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
            <div class="toolbar-actions">
                <button 
                    v-if="item?.hints && item.hints.length > 0" 
                    class="hint-btn" 
                    @click="showNextHint"
                    :disabled="visibleHints >= item.hints.length"
                >
                    💡 {{ visibleHints < item.hints.length ? 'Need a Hint?' : 'All Hints Shown' }} 
                    ({{ visibleHints }}/{{ item.hints.length }})
                </button>
                <button 
                    class="hint-btn" 
                    @click="explainCode"
                    :disabled="!selectedCode || isExplaining"
                    title="Select code to explain"
                >
                    {{ isExplaining ? '⏳ Thinking...' : '🤖 Explain' }}
                </button>
                <button 
                    class="hint-btn" 
                    @click="checkCode" 
                    :disabled="isChecking"
                    title="AI Code Review"
                >
                    {{ isChecking ? '⏳ Checking...' : '🔍 Coach' }}
                </button>
                <button class="run-btn" @click="handleRun" :disabled="isRunning">
                    {{ isRunning ? 'Running...' : '▶ Run Code' }}
                </button>
            </div>
        </div>
        
        <!-- Hints Panel -->
        <div v-if="visibleHints > 0 && item?.hints" class="hints-panel">
            <div v-for="(hint, i) in item.hints.slice(0, visibleHints)" :key="i" class="hint-item">
                <span class="hint-idx">Hint {{ i + 1 }}:</span> {{ hint }}
            </div>
        </div>
        <div class="split-view">
             <CodeEditor 
                v-model="userCode" 
                language="typescript" 
                theme="vs-dark" 
                @selection-change="(val) => selectedCode = val"
             />
             <div class="console-output">
                <div class="console-header">
                    <span>Output</span>
                    <span v-if="testResults" :class="['test-badge', testResults.passed ? 'pass' : 'fail']">
                        {{ testResults.passed ? '✅ Passed' : '❌ Failed' }}
                    </span>
                </div>
                
                <!-- Coach/Validation Area -->
                <div v-if="validationSuggestions.length > 0" class="suggestions-box">
                    <div v-for="(msg, i) in validationSuggestions" :key="i" class="suggestion-item">
                        {{ msg }}
                    </div>
                </div>

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
import { getCodeSuggestions } from '../utils/validation';
import { askAI } from '../services/ai';

const route = useRoute();
const activeTab = ref<'viz' | 'code'>('viz');
const { isMastered, toggleMastery } = useProgress();

// Hint State
const visibleHints = ref(0);
const showNextHint = () => {
    if (item.value?.hints && visibleHints.value < item.value.hints.length) {
        visibleHints.value++;
    }
}

// Reset tab and hints when navigating to a new item
watch(() => route.params.slug, () => {
  activeTab.value = 'viz';
  visibleHints.value = 0;
  explanation.value = '';
  aiAnalysis.value = null;
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
  
  // Prefer specific starter code
  if (item.value.starterCode) return item.value.starterCode;

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

// Selection & Explanation
const selectedCode = ref('');
const explanation = ref('');
const isExplaining = ref(false);

const explainCode = async () => {
    if (!selectedCode.value || !item.value) return;
    
    isExplaining.value = true;
    explanation.value = 'Thinking...';
    
    try {
        const res = await askAI({
            intent: 'explain',
            code: selectedCode.value,
            context: { slug: item.value.slug!, topic: item.value.name }
        });
        explanation.value = res.content;
    } finally {
        isExplaining.value = false;
    }
    
    // Auto-clear after 20s if it's the mock response, checking content length is a heuristic
    if (explanation.value.includes('AI Explanation')) {
        setTimeout(() => explanation.value = '', 20000);
    }
};

// Validation / AI Coach
const aiAnalysis = ref<string | null>(null);
const isChecking = ref(false);

const checkCode = async () => {
    if (!userCode.value || !item.value) return;
    
    isChecking.value = true;
    aiAnalysis.value = null;
    
    try {
        const res = await askAI({
            intent: 'validate',
            code: userCode.value,
            context: { slug: item.value.slug!, topic: item.value.name }
        });
        aiAnalysis.value = res.content;
    } finally {
        isChecking.value = false;
    }
};

// Merged Suggestions (Live Heuristics + AI Analysis)
const validationSuggestions = computed(() => {
    const msgs: string[] = [];
    
    // 1. AI Analysis Result
    if (aiAnalysis.value) {
        msgs.push(aiAnalysis.value);
    }
    
    // 2. Explanation
    if (explanation.value) {
        msgs.push(explanation.value);
    }
    
    // 3. Live Heuristics (only if no AI analysis yet, to avoid clutter?)
    // Actually, let's always show basic heuristics as they are instant
    if (item.value?.slug) {
        const basics = getCodeSuggestions(item.value.slug, userCode.value);
        msgs.push(...basics);
    }
    
    return msgs;
});

const { runCode, output, isRunning, testResults } = useCodeRunner();

const handleRun = () => {
    const tests = item.value?.testCases;
    runCode(userCode.value, tests);
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

.toolbar-actions {
    display: flex;
    gap: 0.5rem;
}

.hint-btn {
    background: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.hint-btn:hover:not(:disabled) {
    background: rgba(37, 99, 235, 0.1);
}

.hint-btn:disabled {
    opacity: 0.5;
    cursor: default;
    border-color: var(--text-muted);
    color: var(--text-muted);
}

.hints-panel {
    background: #fffbeb;
    border: 1px solid #fcd34d;
    padding: 0.75rem;
    color: #92400e;
    font-size: 0.9rem;
    border-left: 1px solid var(--card-border);
    border-right: 1px solid var(--card-border);
}

/* Dark mode adjustment for hints panel if needed, but let's stick to yellow for 'hint' feel */
@media (prefers-color-scheme: dark) {
    .hints-panel {
        background: #422006;
        border-color: #f59e0b;
        color: #fcd34d;
    }
}

.hint-item {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}
.hint-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}
.hint-idx {
    font-weight: bold;
    margin-right: 0.5rem;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.test-badge {
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
}

.test-badge.pass {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
    border: 1px solid #22c55e;
}

.test-badge.fail {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
    border: 1px solid #ef4444;
}

.suggestions-box {
    background: rgba(37, 99, 235, 0.1);
    border-left: 2px solid var(--primary);
    padding: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #93c5fd;
}

.suggestion-item {
    margin-bottom: 0.25rem;
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
