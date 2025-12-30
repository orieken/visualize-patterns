<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Input Fruit Features:</label>
        <div class="inputs">
           <div class="field">
              <span>Color:</span>
              <select v-model="input.color" :disabled="isAnimating">
                 <option value="red">Red</option>
                 <option value="green">Green</option>
                 <option value="yellow">Yellow</option>
              </select>
           </div>
           <div class="field">
              <span>Shape:</span>
              <select v-model="input.shape" :disabled="isAnimating">
                 <option value="round">Round</option>
                 <option value="long">Long</option>
              </select>
           </div>
        </div>
      </div>
      <button @click="classify" class="action-btn" :disabled="isAnimating">
         Ensemble Vote
      </button>
    </div>

    <div class="visualization-container">
       <div class="forest-grid">
          <div 
             v-for="(tree, i) in trees" 
             :key="i" 
             class="mini-tree"
             :class="{ active: tree.active, finished: tree.vote }"
          >
             <div class="tree-icon">🌳</div>
             <div class="tree-id">Tree {{ i + 1 }}</div>
             <div class="tree-focus" v-if="tree.focus">{{ tree.focus }}</div>
             <div class="tree-vote" v-if="tree.vote" :class="tree.vote.toLowerCase()">
                {{ tree.vote }}
             </div>
          </div>
       </div>

       <div class="aggregator" v-if="finalResult">
          <div class="tally">
             <div class="tally-bar">
                <div class="bar-segment apple" :style="{ width: applePct + '%' }"></div>
                <div class="bar-segment banana" :style="{ width: bananaPct + '%' }"></div>
             </div>
             <div class="tally-labels">
                <span>Apple: {{ votes.Apple }}</span>
                <span>Banana: {{ votes.Banana }}</span>
             </div>
          </div>
          <div class="final-verdict">
             Winner: <strong>{{ finalResult }}</strong>
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

type Color = 'red' | 'green' | 'yellow';
type Shape = 'round' | 'long';
type Fruit = 'Apple' | 'Banana';

interface Tree {
  id: number;
  active: boolean;
  vote: Fruit | null;
  focus: string; // What feature this tree prioritized (randomly)
}

const input = ref<{ color: Color, shape: Shape }>({ color: 'red', shape: 'round' });
const trees = ref<Tree[]>([
  { id: 1, active: false, vote: null, focus: 'Color' },
  { id: 2, active: false, vote: null, focus: 'Shape' },
  { id: 3, active: false, vote: null, focus: 'Color & Shape' },
  { id: 4, active: false, vote: null, focus: 'Shape' },
  { id: 5, active: false, vote: null, focus: 'Color' }
]);

const isAnimating = ref(false);
const finalResult = ref<Fruit | null>(null);
const votes = ref({ Apple: 0, Banana: 0 });
const logs = ref<string[]>(['Ready. Select fruit traits and run the Random Forest.']);

const applePct = computed(() => {
  const total = votes.value.Apple + votes.value.Banana;
  if (total === 0) return 50;
  return (votes.value.Apple / total) * 100;
});
const bananaPct = computed(() => {
  const total = votes.value.Apple + votes.value.Banana;
  if (total === 0) return 50;
  return (votes.value.Banana / total) * 100;
});

const classify = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  finalResult.value = null;
  votes.value = { Apple: 0, Banana: 0 };
  
  // Reset trees
  trees.value.forEach(t => { t.active = false; t.vote = null; });
  
  logs.value.push(`Forest: Input [${input.value.color}, ${input.value.shape}] distributed to 5 trees.`);
  
  // Parallel-ish tree execution animation
  for (let i = 0; i < trees.value.length; i++) {
     trees.value[i].active = true;
  }
  
  await delay(600);
  
  // Simulate individual tree logic (imperfect learners)
  // Logic: 
  // Apple: Red/Green + Round
  // Banana: Yellow + Long
  
  const { color, shape } = input.value;
  
  for (let i = 0; i < trees.value.length; i++) {
     const t = trees.value[i];
     const rand = Math.random(); 
     
     // 80% chance to be "correct" based on simple logic, 20% noise (simulating variance)
     let correctVote: Fruit = 'Apple'; 
     if (shape === 'long' || color === 'yellow') correctVote = 'Banana';
     if (shape === 'round' && (color === 'red' || color === 'green')) correctVote = 'Apple';
     
     // Tree 2 is shaped focused, if round -> apple, if long -> banana
     if (t.focus === 'Shape') {
         if (shape === 'round') correctVote = 'Apple'; else correctVote = 'Banana';
     }
     // Tree 1/5 Color focused
     if (t.focus === 'Color') {
         if (color === 'yellow') correctVote = 'Banana'; else correctVote = 'Apple';
     }
     
     // Add some noise (overfitting simulation)
     if (rand > 0.85) {
        t.vote = correctVote === 'Apple' ? 'Banana' : 'Apple';
     } else {
        t.vote = correctVote;
     }
     
     t.active = false;
     
     if (t.vote === 'Apple') votes.value.Apple++;
     else votes.value.Banana++;
     
     logs.value.push(`Tree ${t.id} votes: ${t.vote}`);
     await delay(200);
  }
  
  finalResult.value = votes.value.Apple >= votes.value.Banana ? 'Apple' : 'Banana';
  logs.value.push(`Majority Vote Winner: ${finalResult.value}`);
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

.panel label { font-weight: bold; color: #64748b; font-size: 0.8rem; }

.inputs { display: flex; gap: 1rem; }

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: bold;
}

select {
  padding: 0.3rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}

.action-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover:not(:disabled) { background: #047857; }
.action-btn:disabled { opacity: 0.5; }

.visualization-container {
  padding: 2rem;
  background: #ecfdf5; /* Light evergreen */
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.forest-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mini-tree {
  width: 80px;
  height: 100px;
  background: white;
  border: 1px solid #d1fae5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.mini-tree.active {
  border-color: #059669;
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.2);
}

.mini-tree.finished {
  background: #f0fdf4;
}

.tree-icon { font-size: 2rem; }
.tree-id { font-size: 0.7rem; font-weight: bold; color: #065f46; }
.tree-focus { 
  font-size: 0.55rem; 
  color: #6ee7b7; 
  background: #064e3b; 
  padding: 1px 4px; 
  border-radius: 4px; 
  margin-top: 2px;
}

.tree-vote {
  position: absolute;
  bottom: -10px;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tree-vote.apple { background: #ef4444; }
.tree-vote.banana { background: #f59e0b; }

.aggregator {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  animation: slide-up 0.4s ease-out;
}

.tally-bar {
  display: flex;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f5f9;
  margin-bottom: 0.5rem;
}
.bar-segment { height: 100%; transition: width 0.5s; }
.bar-segment.apple { background: #ef4444; }
.bar-segment.banana { background: #f59e0b; }

.tally-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: bold;
}

.final-verdict {
  text-align: center;
  margin-top: 0.8rem;
  font-size: 1.1rem;
  color: #065f46;
}

.console {
  background: #0f172a;
  color: #6ee7b7;
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

@keyframes pop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
