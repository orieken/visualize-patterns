<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Available Commands:</label>
        <div class="btn-group">
          <button @click="queueCommand('up')" :disabled="isAnimating">⬆ Move Up</button>
          <button @click="queueCommand('down')" :disabled="isAnimating">⬇ Move Down</button>
          <button @click="queueCommand('left')" :disabled="isAnimating">⬅ Move Left</button>
          <button @click="queueCommand('right')" :disabled="isAnimating">➡ Move Right</button>
        </div>
      </div>

      <div class="panel actions">
         <button @click="undoLast" class="action-btn undo" :disabled="isAnimating || history.length === 0">
           ↩ Undo
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="grid-area">
          <div class="grid-bg">
             <!-- Simple 5x5 grid lines -->
             <div v-for="i in 5" :key="'r'+i" class="grid-row">
               <div v-for="j in 5" :key="'c'+j" class="grid-cell"></div>
             </div>
             
             <!-- Robot -->
             <div class="robot" :style="robotStyle">
                🤖
             </div>
          </div>
       </div>

       <div class="history-panel">
          <div class="history-title">Command History Stack</div>
          <div class="history-list">
             <div v-if="history.length === 0" class="empty">No commands executed yet.</div>
             <transition-group name="list">
               <div v-for="(cmd, idx) in history.slice().reverse()" :key="cmd.id" class="history-item">
                  <span class="cmd-icon">{{ cmd.icon }}</span>
                  <span class="cmd-name">{{ cmd.name }}</span>
               </div>
             </transition-group>
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

type Direction = 'up' | 'down' | 'left' | 'right';

interface Command {
  id: number;
  type: Direction;
  name: string;
  icon: string;
}

// State
const robotPos = ref({ x: 2, y: 2 }); // 0-4 grid
const history = ref<Command[]>([]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Issue commands to the Robot.']);
let cmdIdCounter = 1;

const robotStyle = computed(() => {
  return {
    left: `${robotPos.value.x * 20}%`,
    top: `${robotPos.value.y * 20}%`
  };
});

// Logic
const queueCommand = async (dir: Direction) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  // Create Command Object
  const cmd: Command = {
    id: cmdIdCounter++,
    type: dir,
    name: `Move ${dir.charAt(0).toUpperCase() + dir.slice(1)}`,
    icon: dir === 'up' ? '⬆' : dir === 'down' ? '⬇' : dir === 'left' ? '⬅' : '➡'
  };
  
  logs.value.push(`Invoker: Executing Command: ${cmd.name}`);
  
  // Execute
  moveRobot(dir);
  history.value.push(cmd); // Push to history stack
  
  await delay(300);
  isAnimating.value = false;
};

const undoLast = async () => {
  if (isAnimating.value || history.value.length === 0) return;
  isAnimating.value = true;
  
  const lastCmd = history.value.pop();
  if (lastCmd) {
     logs.value.push(`Invoker: Undoing Command: ${lastCmd.name}`);
     // Opposite moves
     const undoDir = 
       lastCmd.type === 'up' ? 'down' :
       lastCmd.type === 'down' ? 'up' :
       lastCmd.type === 'left' ? 'right' : 'left';
       
     moveRobot(undoDir);
  }
  
  await delay(300);
  isAnimating.value = false;
};

const moveRobot = (dir: Direction) => {
  let { x, y } = robotPos.value;
  if (dir === 'up') y = Math.max(0, y - 1);
  if (dir === 'down') y = Math.min(4, y + 1);
  if (dir === 'left') x = Math.max(0, x - 1);
  if (dir === 'right') x = Math.min(4, x + 1);
  robotPos.value = { x, y };
};

const reset = () => {
  history.value = [];
  robotPos.value = { x: 2, y: 2 };
  logs.value = ['Robot reset.'];
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.panel label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.btn-group {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.btn-group button {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #334155;
}

.btn-group button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.actions {
  flex-direction: row;
  align-items: center;
}

.action-btn.undo {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.action-btn.undo:hover:not(:disabled) { background: #d97706; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  height: 300px;
  background: #f0f9ff;
}

.grid-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-bg {
  width: 250px;
  height: 250px;
  background: white;
  border: 2px solid #334155;
  display: grid; /* We just use flex loops for lines actually */
  position: relative;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.grid-row {
  display: flex;
  height: 20%;
  width: 100%;
}

.grid-cell {
  width: 20%;
  height: 100%;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
}

.robot {
  position: absolute;
  width: 20%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.history-panel {
  width: 200px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.history-title {
  background: #e2e8f0;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  color: #475569;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.empty {
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  margin-top: 2rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.4rem;
  border-radius: 4px;
  border-left: 3px solid #6366f1;
  font-size: 0.8rem;
}

.cmd-icon { font-size: 1rem; }
.cmd-name { font-weight: 500; color: #334155; }

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

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
