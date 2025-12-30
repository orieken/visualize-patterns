<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="editor-controls">
         <div class="field">
           <label>Name</label>
           <input v-model="state.name" placeholder="Hero Name" :disabled="isAnimating" />
         </div>
         <div class="field">
           <label>Weapon</label>
           <select v-model="state.weapon" :disabled="isAnimating">
             <option>Sword</option>
             <option>Bow</option>
             <option>Staff</option>
             <option>Axe</option>
           </select>
         </div>
         <div class="field">
           <label>Health ({{ state.health }})</label>
           <input type="range" v-model.number="state.health" min="1" max="100" :disabled="isAnimating" />
         </div>
         <button @click="randomize" class="action-btn sm" :disabled="isAnimating">🎲 Random</button>
      </div>

      <div class="actions">
         <button @click="saveSnapshot" class="save-btn" :disabled="isAnimating">
           💾 Save Checkpoint
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <!-- CURRENT STATE -->
       <div class="state-card current">
          <div class="card-title">Current State (Originator)</div>
          <div class="character-preview">
             <div class="char-icon">{{ getIcon(state.weapon) }}</div>
             <div class="char-details">
                <div class="char-name">{{ state.name || 'Unknown' }}</div>
                <div class="char-meta">Lvl 1 {{ state.weapon }}</div>
                <div class="hp-bar"><div class="hp-fill" :style="{ width: state.health + '%' }"></div></div>
             </div>
          </div>
       </div>

       <div class="arrow-divider">
          History Caretaker
          <span>⮕</span>
       </div>

       <!-- SAVED SNAPSHOTS -->
       <div class="history-list">
          <div v-if="mementos.length === 0" class="empty">No snapshots saved.</div>
          <transition-group name="list">
             <div 
               v-for="(memento, idx) in mementos.slice().reverse()" 
               :key="memento.id" 
               class="state-card snapshot"
             >
                <div class="snapshot-header">
                   <span class="timestamp">{{ memento.time }}</span>
                   <button @click="restore(memento)" class="restore-btn" :disabled="isAnimating">Restore ↺</button>
                </div>
                <div class="mini-details">
                   <span>{{ memento.state.name }}</span> • <span>{{ memento.state.weapon }}</span> • <span class="hp">HP {{ memento.state.health }}</span>
                </div>
             </div>
          </transition-group>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface GameState {
  name: string;
  weapon: string;
  health: number;
}

interface Memento {
  id: number;
  time: string;
  state: GameState; // Immutable snapshot
}

// Originator State
const state = reactive<GameState>({
  name: 'Hero',
  weapon: 'Sword',
  health: 100
});

const mementos = ref<Memento[]>([]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Adjust the character stats and Save Checkpoints.']);
let idCounter = 1;

const getIcon = (w: string) => {
  if (w === 'Sword') return '⚔️';
  if (w === 'Bow') return '🏹';
  if (w === 'Staff') return '🪄';
  if (w === 'Axe') return '🪓';
  return '❓';
};

const randomize = () => {
   const names = ['Aragorn', 'Legolas', 'Gandalf', 'Gimli', 'Frodo'];
   const weapons = ['Sword', 'Bow', 'Staff', 'Axe'];
   state.name = names[Math.floor(Math.random() * names.length)];
   state.weapon = weapons[Math.floor(Math.random() * weapons.length)];
   state.health = Math.floor(Math.random() * 50) + 50;
};

const saveSnapshot = async () => {
  if (isAnimating.value) return;
  
  // Create Memento (Deep copy state)
  const snapshot: Memento = {
    id: idCounter++,
    time: new Date().toLocaleTimeString(),
    state: JSON.parse(JSON.stringify(state))
  };
  
  mementos.value.push(snapshot);
  logs.value.push(`Caretaker: Saved snapshot #${snapshot.id} (${snapshot.state.name}).`);
};

const restore = async (memento: Memento) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  logs.value.push(`Originator: Restoring state from Memento #${memento.id}...`);
  
  // Animation delay
  await delay(300);
  
  // Restore state
  state.name = memento.state.name;
  state.weapon = memento.state.weapon;
  state.health = memento.state.health;
  
  logs.value.push(`Restored.`);
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
  align-items: flex-end;
}

.editor-controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.field label { font-size: 0.7rem; font-weight: bold; color: #64748b; }
.field input, .field select {
  padding: 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.9rem;
}

.action-btn.sm {
  padding: 0.4rem 0.8rem;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  height: 34px;
}
.action-btn.sm:hover:not(:disabled) { background: #f1f5f9; }

.save-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}
.save-btn:hover:not(:disabled) { background: #1d4ed8; }
.save-btn:disabled { opacity: 0.5; }

.visualization-container {
  display: flex;
  gap: 1rem;
  padding: 2rem;
  background: #eff6ff;
  height: 320px;
}

.arrow-divider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: bold;
  text-transform: uppercase;
  width: 80px;
}
.arrow-divider span { font-size: 2rem; color: #cbd5e1; }

.state-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.state-card.current {
  width: 250px;
  border-top: 4px solid #2563eb;
}

.card-title {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.character-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.char-icon { font-size: 3rem; }
.char-details { flex: 1; }
.char-name { font-weight: 800; font-size: 1.2rem; color: #1e293b; }
.char-meta { font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }

.hp-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}
.hp-fill {
  height: 100%;
  background: #ef4444;
  transition: width 0.3s;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
}

.empty {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 3rem;
}

.snapshot {
  border-left: 3px solid #cbd5e1;
  padding: 0.8rem;
  transition: all 0.2s;
}
.snapshot:hover {
  border-left-color: #2563eb;
  transform: translateX(2px);
}

.snapshot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timestamp { font-size: 0.7rem; color: #94a3b8; }

.restore-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #2563eb;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.restore-btn:hover:not(:disabled) { background: #eff6ff; border-color: #bfdbfe; }

.mini-details { font-size: 0.85rem; font-weight: 500; color: #334155; }
.hp { color: #ef4444; font-weight: bold; }

.console {
  background: #0f172a;
  color: #93c5fd;
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
  transform: translateX(-10px);
}
</style>
