<script setup lang="ts">
import { ref } from 'vue';
import CodeEditor from '../components/CodeEditor.vue';
import { useCodeRunner } from '../composables/useCodeRunner';

const code = ref(`// Write your TypeScript code here
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
console.log("Result:", calc.add(10, 5));
`);

const { runCode, output, isRunning } = useCodeRunner();

const handleRun = () => {
    runCode(code.value);
};
</script>

<template>
  <div class="playground-layout">
    <div class="editor-pane">
        <div class="toolbar">
            <span class="label">TypeScript Editor</span>
            <button class="run-btn" @click="handleRun" :disabled="isRunning">
                {{ isRunning ? 'Running...' : '▶ Run Code' }}
            </button>
        </div>
        <CodeEditor v-model="code" language="typescript" theme="vs-dark" />
    </div>
    
    <div class="output-pane">
        <div class="toolbar">
            <span class="label">Console Output</span>
            <button class="clear-btn" @click="output = []">Clear</button>
        </div>
        <div class="console-output">
            <div v-if="output.length === 0" class="placeholder">Output will appear here...</div>
            <div v-for="(line, i) in output" :key="i" class="log-line">
                {{ line }}
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.playground-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: calc(100vh - 140px);
    min-height: 500px;
}

.editor-pane, .output-pane {
    display: flex;
    flex-direction: column;
    background: var(--card-bg);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    border: 1px solid var(--card-border);
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(0,0,0,0.03);
    border-bottom: 1px solid var(--card-border);
}

.label {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.run-btn {
    background: #22c55e;
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.run-btn:hover {
    background: #16a34a;
}

.run-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.clear-btn {
    background: transparent;
    border: 1px solid var(--card-border);
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
}

.console-output {
    flex: 1;
    background: #1e1e1e;
    color: #e0e0e0;
    font-family: 'Fira Code', monospace;
    padding: 1rem;
    overflow-y: auto;
    font-size: 0.9rem;
}

.log-line {
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 0.2rem 0;
}

.placeholder {
    color: rgba(255,255,255,0.3);
    font-style: italic;
}

@media (max-width: 768px) {
    .playground-layout {
        grid-template-columns: 1fr;
        height: auto;
    }
    .editor-pane, .output-pane {
        height: 400px;
    }
}
</style>
