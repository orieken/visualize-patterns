<template>
  <div class="truth-tree-viz">
    <div class="controls">
       <div class="statement">
          Checking: <strong>{{ formula }}</strong>
       </div>
       <button class="btn" @click="reset">Reset</button>
       <button class="btn primary" @click="step" :disabled="done || steps.length === 0">Next Step</button>
    </div>

    <div class="tree-display">
       <div v-for="(node, i) in branch" :key="i" class="tree-node" :class="{ new: i === branch.length - 1 }">
          <span class="line-num">{{ i + 1 }}.</span>
          <span class="formula">{{ node.text }}</span>
          <span class="reason">({{ node.reason }})</span>
          <span class="status" v-if="node.status">{{ node.status }}</span>
       </div>
    </div>
    
    <div v-if="done" class="verdict" :class="{ 'closed': isClosed }">
       {{ isClosed ? '❌ X (CLOSED - Contradiction)' : '✅ O (OPEN - Satisfiable)' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const formula = ref('(A ∧ ¬A)');
const branch = ref<{text: string, reason: string, status?: string}[]>([]);
const steps = ref<any[]>([]);

const isClosed = ref(false);
const done = ref(false);

const init = () => {
    branch.value = [
        { text: 'A ∧ ¬A', reason: 'Assumption' }
    ];
    // Hardcoded steps for the demo of (A and not A)
    steps.value = [
        () => branch.value.push({ text: 'A', reason: 'From 1 (AND)' }),
        () => branch.value.push({ text: '¬A', reason: 'From 1 (AND)' }),
        () => {
            branch.value[branch.value.length-1].status = 'X';
            isClosed.value = true;
            done.value = true; 
        }
    ];
    isClosed.value = false;
    done.value = false;
}

const step = () => {
    const action = steps.value.shift();
    if(action) action();
}

const reset = () => init();

init(); // Start
</script>

<style scoped>
.truth-tree-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.5);
    padding: 0.5rem;
    border-radius: 8px;
}
.statement {
    font-size: 0.9rem;
    color: #334155;
}
.btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 0.8rem;
}
.btn.primary {
    background: #2563eb;
    color: white;
    border: none;
}
.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tree-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    min-height: 200px;
}

.tree-node {
    display: grid;
    grid-template-columns: 30px 100px 100px 30px;
    align-items: center;
    gap: 1rem;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background 0.3s;
}
.tree-node.new {
    background: #f0f9ff;
    border: 1px dashed #bae6fd;
}

.line-num { color: #94a3b8; font-size: 0.8rem; text-align: right; }
.formula { font-weight: bold; font-family: monospace; text-align: center; }
.reason { color: #64748b; font-size: 0.8rem; font-style: italic; }
.status { color: #ef4444; font-weight: bold; }

.verdict {
    text-align: center;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 4px;
    background: #dcfce7;
    color: #15803d;
}
.verdict.closed {
    background: #fee2e2;
    color: #b91c1c;
}
</style>
