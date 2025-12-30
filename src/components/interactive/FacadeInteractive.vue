<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="info">
         Facade Pattern: Providing a simple interface (HomeTheater) to a complex subsystem.
      </div>
      <div class="actions">
         <button @click="watchMovie" class="action-btn" :disabled="isAnimating || isPlaying">
           🍿 Watch Movie
         </button>
         <button @click="endMovie" class="action-btn secondary" :disabled="isAnimating || !isPlaying">
           🛑 End Movie
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="client-side">
          <div class="user-avatar">👤</div>
          <div class="call-arrow" :class="{ active: isAnimating }">
             {{ currentAction || 'Ready' }}
          </div>
          <div class="facade-box">
             <div class="label">HomeTheaterFacade</div>
          </div>
       </div>

       <div class="subsystems-grid">
          <div class="subsystem" :class="{ active: systems.lights }">
             <div class="icon">💡</div>
             <div class="name">Lights</div>
             <div class="status">{{ systems.lights ? 'Dimmed' : 'Bright' }}</div>
          </div>
          <div class="subsystem" :class="{ active: systems.screen }">
             <div class="icon">⬜</div>
             <div class="name">Screen</div>
             <div class="status">{{ systems.screen ? 'Down' : 'Up' }}</div>
          </div>
          <div class="subsystem" :class="{ active: systems.projector }">
             <div class="icon">📽️</div>
             <div class="name">Projector</div>
             <div class="status">{{ systems.projector ? 'On' : 'Off' }}</div>
          </div>
          <div class="subsystem" :class="{ active: systems.amp }">
             <div class="icon">🔊</div>
             <div class="name">Amplifier</div>
             <div class="status">{{ systems.amp ? 'On' : 'Off' }}</div>
          </div>
          <div class="subsystem" :class="{ active: systems.player }">
             <div class="icon">💿</div>
             <div class="name">Player</div>
             <div class="status">{{ systems.player ? 'Playing' : 'Stopped' }}</div>
          </div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const systems = reactive({
  lights: false,
  screen: false,
  projector: false,
  amp: false,
  player: false
});

const isAnimating = ref(false);
const isPlaying = ref(false);
const currentAction = ref('');
const logs = ref<string[]>(['Ready. Use the Facade to simplify the complex startup sequence.']);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const watchMovie = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  isPlaying.value = true;
  currentAction.value = 'watchMovie()';
  logs.value.push('Client calls facade.watchMovie()...');

  await delay(500);
  
  logs.value.push('Facade: Dimming lights...');
  systems.lights = true;
  await delay(400);

  logs.value.push('Facade: Lowering screen...');
  systems.screen = true;
  await delay(400);

  logs.value.push('Facade: Turning on projector...');
  systems.projector = true;
  await delay(400);

  logs.value.push('Facade: Turning on amplifier...');
  systems.amp = true;
  await delay(400);

  logs.value.push('Facade: Starting DVD player...');
  systems.player = true;
  await delay(400);
  
  currentAction.value = 'Enjoy!';
  logs.value.push('Movie started! All systems go.');
  isAnimating.value = false;
};

const endMovie = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentAction.value = 'endMovie()';
  logs.value.push('Client calls facade.endMovie()...');

  await delay(500);

  logs.value.push('Facade: Stopping player...');
  systems.player = false;
  await delay(300);

  logs.value.push('Facade: Turning off amp...');
  systems.amp = false;
  await delay(300);

  logs.value.push('Facade: Turning off projector...');
  systems.projector = false;
  await delay(300);

  logs.value.push('Facade: Raising screen...');
  systems.screen = false;
  await delay(300);

  logs.value.push('Facade: Lights up...');
  systems.lights = false;
  await delay(300);

  currentAction.value = '';
  isPlaying.value = false;
  logs.value.push('System shutdown complete.');
  isAnimating.value = false;
};
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
  max-width: 50%;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #f43f5e; /* Rose */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #be123c; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.action-btn.secondary {
  background: white;
  color: #f43f5e;
  border: 1px solid #f43f5e;
}

.visualization-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  height: 300px;
  background: #1e293b; /* Dark theme for heater */
  align-items: center;
}

.client-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 120px;
  color: white;
}

.user-avatar { font-size: 2.5rem; }

.call-arrow {
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 0.5rem;
  transition: all 0.3s;
}

.call-arrow.active {
  background: #334155;
  color: #fb7185;
  font-weight: bold;
}

.facade-box {
  width: 100%;
  padding: 1rem;
  border: 2px solid #fb7185;
  border-radius: 8px;
  background: rgba(251, 113, 133, 0.1);
  text-align: center;
}

.facade-box .label {
  font-size: 0.7rem;
  font-weight: bold;
  color: #fb7185;
}

.subsystems-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.subsystem {
  background: #334155;
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.4s;
  border: 2px solid transparent;
}

.subsystem.active {
  background: #0f172a;
  border-color: #34d399; /* Green active */
  color: #34d399;
  box-shadow: 0 0 15px rgba(52, 211, 153, 0.2);
}

.subsystem .icon { font-size: 1.5rem; margin-bottom: 0.2rem; }
.subsystem .name { font-size: 0.75rem; font-weight: bold; }
.subsystem .status { font-size: 0.65rem; opacity: 0.8; }

.console {
  background: #000;
  color: #fb7185;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  height: 120px;
  overflow-y: auto;
  border-top: 1px solid #334155;
  display: flex;
  flex-direction: column;
}

.log-entry {
  opacity: 0.9;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 0.1rem 0;
}
</style>
