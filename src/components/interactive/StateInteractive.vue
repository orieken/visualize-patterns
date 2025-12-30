<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Media Player Controls:</label>
        <div class="btn-group">
          <button @click="trigger('play')" :disabled="isAnimating" class="play-btn">▶ Play</button>
          <button @click="trigger('stop')" :disabled="isAnimating" class="stop-btn">⏹ Stop</button>
          <button @click="trigger('next')" :disabled="isAnimating" class="next-btn">⏭ Next</button>
          <button @click="trigger('lock')" :disabled="isAnimating" class="lock-btn">🔒 Lock/Unlock</button>
        </div>
      </div>
    </div>

    <div class="visualization-container">
       <div class="player-case" :class="{ locked: currentStateName === 'Locked' }">
          <div class="screen">
            <div class="screen-content" :class="currentStateName.toLowerCase()">
               <div class="icon">{{ getIcon(currentStateName) }}</div>
               <div class="state-label">{{ currentStateName }} State</div>
            </div>
            <div class="status-bar" v-if="currentStateName === 'Playing'">
               <div class="progress-bar"></div>
            </div>
            <div class="error-toast" v-if="errorMsg">{{ errorMsg }}</div>
          </div>
       </div>

       <div class="state-diagram">
          <div class="diagram-node" :class="{ active: currentStateName === 'Ready' }">Ready</div>
          <div class="diagram-node" :class="{ active: currentStateName === 'Playing' }">Playing</div>
          <div class="diagram-node" :class="{ active: currentStateName === 'Locked' }">Locked</div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type StateName = 'Ready' | 'Playing' | 'Locked';
type Action = 'play' | 'stop' | 'next' | 'lock';

interface State {
  name: StateName;
  play(): void;
  stop(): void;
  next(): void;
  lock(): void;
}

// Context: AudioPlayer
const currentStateName = ref<StateName>('Ready');
const errorMsg = ref('');
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Player is stopped. Use buttons to change state.']);

const setError = (msg: string) => {
  errorMsg.value = msg;
  setTimeout(() => errorMsg.value = '', 1500);
};

// Implementations of States
const states: Record<StateName, State> = {
  Ready: {
    name: 'Ready',
    play: () => {
      logs.value.push('Ready -> Play: Starting playback.');
      transitionTo('Playing');
    },
    stop: () => logs.value.push('Ready -> Stop: Already stopped.'),
    next: () => logs.value.push('Ready -> Next: Locked on next track in queue.'), // Just pretend
    lock: () => {
      logs.value.push('Ready -> Lock: Locking player.');
      transitionTo('Locked');
    }
  },
  Playing: {
    name: 'Playing',
    play: () => {
       logs.value.push('Playing -> Play: Pausing playback.');
       transitionTo('Ready'); // Simulating pause
    },
    stop: () => {
       logs.value.push('Playing -> Stop: Stopping playback.');
       transitionTo('Ready');
    },
    next: () => {
       logs.value.push('Playing -> Next: Skipping to next track...');
       // Stay in Playing usually
       transitionTo('Playing'); 
    },
    lock: () => {
       logs.value.push('Playing -> Lock: Locking player keys.');
       transitionTo('Locked');
    }
  },
  Locked: {
    name: 'Locked',
    play: () => setError('Locked! Cannot use controls.'),
    stop: () => setError('Locked! Cannot use controls.'),
    next: () => setError('Locked! Cannot use controls.'),
    lock: () => {
       logs.value.push('Locked -> Unlock: Unlocking player.');
       transitionTo('Ready'); // Or previous state ideally, simplifying to Ready
    }
  }
};

const transitionTo = async (name: StateName) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentStateName.value = name;
  await delay(300); // Visual cue
  isAnimating.value = false;
};

const trigger = (action: Action) => {
  const state = states[currentStateName.value];
  if (state && state[action]) {
    state[action]();
  }
};

const getIcon = (s: string) => {
  if (s === 'Ready') return '⏸';
  if (s === 'Playing') return '🎵';
  if (s === 'Locked') return '🔒';
  return '';
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

.panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.panel label { font-weight: bold; font-size: 0.8rem; color: #64748b; }

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-group button {
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  background: white;
}

.play-btn:hover { background: #dcfce7; color: #166534; border-color: #86efac; }
.stop-btn:hover { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.next-btn:hover { background: #e0f2fe; color: #075985; border-color: #7dd3fc; }
.lock-btn:hover { background: #f3f4f6; color: #374151; }

.visualization-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: #f8fafc;
  min-height: 250px;
  align-items: center;
  justify-content: center;
}

.player-case {
  width: 180px;
  height: 250px;
  background: #334155;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.5s;
}

.player-case.locked {
  border: 2px solid #ef4444;
}

.screen {
  width: 100%;
  height: 140px;
  background: #0f172a;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.screen-content {
  text-align: center;
  opacity: 0.8;
  transition: all 0.3s;
}
.screen-content.playing { opacity: 1; color: #4ade80; text-shadow: 0 0 10px #4ade80; }
.screen-content.locked { opacity: 0.6; color: #ef4444; }

.icon { font-size: 3rem; margin-bottom: 0.5rem; }
.state-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

.status-bar {
  width: 80%;
  height: 4px;
  background: #334155;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}
.progress-bar {
  width: 50%;
  height: 100%;
  background: #4ade80;
  animation: progress 2s linear infinite;
}

@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.error-toast {
  position: absolute;
  bottom: 10px;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 4px;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.state-diagram {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diagram-node {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  color: #64748b;
  font-size: 0.8rem;
  text-align: center;
  transition: all 0.3s;
  width: 80px;
}

.diagram-node.active {
  background: #334155;
  color: white;
  border-color: #1e293b;
  font-weight: bold;
  transform: scale(1.1);
}

.console {
  background: #0f172a;
  color: #fca5a5;
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
