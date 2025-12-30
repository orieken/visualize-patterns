<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="input-group">
        <label>Expression:</label>
        <input 
          v-model="expression" 
          placeholder="e.g. 5 + 3 - 2" 
          :disabled="isAnimating"
          @keyup.enter="interpret"
        />
        <button @click="interpret" class="action-btn" :disabled="isAnimating || !expression.trim()">
           Evaluate
        </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="tree-display">
          <div v-if="!tree" class="placeholder">Enter an expression (e.g., "10 + 5 - 2")</div>
          <node-view v-else :node="tree" :active-id="activeNodeId" :results="results" />
       </div>

       <div class="result-display" :class="{ visible: finalResult !== null }">
          Result: <strong>{{ finalResult }}</strong>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h, PropType } from 'vue';

// -- Interpreter Classes --
interface Expression {
  id: string;
  interpret(): number;
  toString(): string;
}

class NumberExpression implements Expression {
  constructor(public id: string, public value: number) {}
  interpret() { return this.value; }
  toString() { return this.value.toString(); }
}

class AddExpression implements Expression {
  constructor(public id: string, public left: Expression, public right: Expression) {}
  interpret() { return this.left.interpret() + this.right.interpret(); }
  toString() { return `+`; }
}

class SubtractExpression implements Expression {
  constructor(public id: string, public left: Expression, public right: Expression) {}
  interpret() { return this.left.interpret() - this.right.interpret(); }
  toString() { return `-`; }
}


// -- Components --
const NodeView: any = defineComponent({
  name: 'NodeView',
  props: {
    node: { type: Object as PropType<any>, required: true },
    activeId: { type: String, default: null },
    results: { type: Object, required: true }
  },
  setup(props) {
    return () => {
      const { node, activeId, results } = props;
      const isActive = node.id === activeId;
      const result = results[node.id];
      const isLeaf = node instanceof NumberExpression;

      return h('div', { class: ['node-wrapper'] }, [
        h('div', { class: ['node-content', { active: isActive, leaf: isLeaf }] }, [
          h('span', { class: 'node-text' }, node.toString()),
          result !== undefined ? h('span', { class: 'node-result' }, `= ${result}`) : null
        ]),
        !isLeaf ? h('div', { class: 'children' }, [
           h(NodeView, { node: node.left, activeId, results }),
           h(NodeView, { node: node.right, activeId, results })
        ]) : null
      ]);
    };
  }
});

// -- State --
const expression = ref('10 + 5 - 3');
const tree = ref<Expression | null>(null);
const activeNodeId = ref<string | null>(null);
const results = ref<Record<string, number>>({});
const finalResult = ref<number | null>(null);
const logs = ref<string[]>(['Ready. Enter a math expression (+ and - supported).']);
const isAnimating = ref(false);

let idCounter = 0;

// -- Logic --
const parse = (tokens: string[]): Expression => {
  // Very simple left-associative parser for + and -
  // 1. Parse number
  let left: Expression = new NumberExpression(`n${idCounter++}`, parseInt(tokens.shift()!));

  while (tokens.length > 0) {
    const op = tokens.shift();
    const rightVal = parseInt(tokens.shift()!);
    const right = new NumberExpression(`n${idCounter++}`, rightVal);

    if (op === '+') {
      left = new AddExpression(`op${idCounter++}`, left, right); // Type assertion removed
    } else if (op === '-') {
      left = new SubtractExpression(`op${idCounter++}`, left, right); // Type assertion removed
    }
  }
  return left;
};

const interpret = async () => {
  if (isAnimating.value) return;
  
  // Reset
  idCounter = 0;
  tree.value = null;
  results.value = {};
  finalResult.value = null;
  activeNodeId.value = null;
  logs.value = [];

  // Parse
  const tokens = expression.value.split(' ').filter(t => t.trim());
  try {
      tree.value = parse([...tokens]); // Copy tokens
      logs.value.push(`Parsed tree from: "${expression.value}"`);
  } catch (e) {
      logs.value.push('Error: Invalid expression format. Use "1 + 2 - 3".');
      return;
  }

  isAnimating.value = true;
  await delay(500);
  
  // Evaluate
  const res = await evaluate(tree.value as any);
  
  finalResult.value = res;
  logs.value.push(`Final Result: ${res}`);
  isAnimating.value = false;
};

const evaluate = async (node: any): Promise<number> => {
   activeNodeId.value = node.id;
   logs.value.push(`Visiting ${node.constructor.name} (${node.toString()})...`);
   await delay(600);
   
   let val = 0;
   if (node instanceof NumberExpression) {
      val = node.interpret();
   } else if (node instanceof AddExpression || node instanceof SubtractExpression) {
      logs.value.push(`Recursing left...`);
      const l = await evaluate(node.left);
      
      logs.value.push(`Recursing right...`);
      const r = await evaluate(node.right);
      
      activeNodeId.value = node.id; // Refocus parent
      val = node.interpret(); // Re-run interpret essentially, or calculate from l/r
      // Actually interpret() re-runs logic but we optimize display here
      // Let's just trust interpret()
   }

   results.value[node.id] = val;
   logs.value.push(`Computed ${node.toString()} = ${val}`);
   await delay(300);
   return val;
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
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-group label {
  font-weight: bold;
  font-size: 0.8rem;
  color: #64748b;
}

.input-group input {
  padding: 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-family: monospace;
  width: 200px;
}

.action-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #fdf4ff; /* Light purple/fuchsia */
  min-height: 300px;
}

.tree-display {
  width: 100%;
  display: flex;
  justify-content: center;
}

.placeholder {
  color: #a21caf;
  font-style: italic;
}

/* Recursive node styles */
:deep(.node-wrapper) {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

:deep(.node-content) {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e879f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

:deep(.node-content.leaf) {
  border-radius: 8px;
  width: 60px;
  background: #fae8ff;
}

:deep(.node-content.active) {
  background: #d946ef;
  color: white;
  border-color: #c026d3;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
}

:deep(.node-text) { font-weight: bold; font-family: monospace; font-size: 1.1rem; }
:deep(.node-result) { 
  font-size: 0.7rem; 
  background: #10b981; 
  color: white; 
  padding: 1px 4px;
  border-radius: 4px;
  position: absolute;
  bottom: -10px;
  white-space: nowrap;
}

:deep(.children) {
  display: flex;
}

.result-display {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #334155;
  opacity: 0;
  transition: opacity 0.5s;
}

.result-display.visible { opacity: 1; }

.console {
  background: #0f172a;
  color: #e879f9;
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
