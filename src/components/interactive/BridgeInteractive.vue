<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="config-row">
         <div class="group">
           <label>Abstraction (Remote):</label>
           <button @click="remoteType = 'basic'" :class="{ active: remoteType === 'basic' }">BasicRemote</button>
           <button @click="remoteType = 'advanced'" :class="{ active: remoteType === 'advanced' }">AdvancedRemote</button>
         </div>
         <div class="group">
           <label>Implementation (Device):</label>
           <button @click="deviceType = 'tv'" :class="{ active: deviceType === 'tv' }">TV</button>
           <button @click="deviceType = 'radio'" :class="{ active: deviceType === 'radio' }">Radio</button>
         </div>
      </div>
    </div>

    <div class="visualization-container">
       <!-- Abstraction Side -->
       <div class="panel remote-panel">
          <div class="panel-label">{{ remoteType === 'basic' ? 'BasicRemote' : 'AdvancedRemote' }}</div>
          <div class="remote-body">
             <button class="remote-btn power" @click="togglePower">
               PWR
             </button>
             <button v-if="remoteType === 'advanced'" class="remote-btn mute" @click="mute">
               MUTE
             </button>
          </div>
          <div class="code-ref">this.device -></div>
       </div>

       <!-- Bridge -->
       <div class="bridge-connection">
          -----------------►
       </div>

       <!-- Implementation Side -->
       <div class="panel device-panel" :class="deviceType">
          <div class="panel-label">{{ deviceType === 'tv' ? 'TV Device' : 'Radio Device' }}</div>
          <div class="device-screen" :class="{ on: deviceState.isOn }">
             <div v-if="!deviceState.isOn" class="off-text">OFF</div>
             <div v-else class="on-content">
                <span class="icon">{{ deviceType === 'tv' ? '📺' : '📻' }}</span>
                <span class="vol">Vol: {{ deviceState.volume }}</span>
             </div>
          </div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';

type RemoteType = 'basic' | 'advanced';
type DeviceType = 'tv' | 'radio';

const remoteType = ref<RemoteType>('basic');
const deviceType = ref<DeviceType>('tv');

const deviceState = reactive({
  isOn: false,
  volume: 10
});

const logs = ref<string[]>(['Ready. Pair a Remote (Abstraction) with a Device (Implementation).']);

// Reset state when switching device
watch(deviceType, () => {
   deviceState.isOn = false;
   deviceState.volume = 10;
   logs.value.push(`Switched implementation to ${deviceType.value.toUpperCase()}.`);
});
watch(remoteType, () => {
   logs.value.push(`Switched abstraction to ${remoteType.value === 'basic' ? 'Basic' : 'Advanced'}Remote.`);
});

const togglePower = () => {
  deviceState.isOn = !deviceState.isOn;
  logs.value.push(`${remoteType.value}Remote calls device.togglePower() -> ${deviceType.value} is now ${deviceState.isOn ? 'ON' : 'OFF'}.`);
};

const mute = () => {
  if (!deviceState.isOn) {
      logs.value.push('Device is OFF. Cannot mute.');
      return;
  }
  deviceState.volume = 0;
  logs.value.push(`AdvancedRemote calls device.setVolume(0) -> ${deviceType.value} Muted.`);
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
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.config-row {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.group button {
  background: #e2e8f0;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #475569;
}

.group button.active {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.visualization-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  height: 250px;
  background: #f1f5f9;
}

.panel {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 1rem;
  width: 140px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.panel-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 1rem;
  text-align: center;
}

.remote-panel { border-top: 4px solid #3b82f6; }
.device-panel { border-top: 4px solid #10b981; }

.remote-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.remote-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.remote-btn.power { background: #ef4444; }
.remote-btn.power:hover { background: #dc2626; }
.remote-btn.mute { background: #64748b; }
.remote-btn.mute:hover { background: #475569; }

.code-ref {
  margin-top: auto;
  font-family: monospace;
  font-size: 0.65rem;
  color: #94a3b8;
  width: 100%;
  text-align: right;
}

.bridge-connection {
  color: #94a3b8;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: -1px;
}

.device-screen {
  background: #0f172a;
  width: 100%;
  flex: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  transition: all 0.3s;
}

.device-screen.on {
  background: #dbeafe; /* Light blue glow for TV */
  color: #1e40af;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.device-panel.radio .device-screen.on {
  background: #fce7f3; /* Pinkish for radio? */
  color: #be185d;
  box-shadow: 0 0 15px rgba(219, 39, 119, 0.5);
}

.off-text { font-size: 0.8rem; font-weight: bold; }

.on-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.icon { font-size: 2rem; }
.vol { font-size: 0.7rem; font-weight: bold; }

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
</style>
