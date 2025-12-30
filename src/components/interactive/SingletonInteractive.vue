<template>
  <div class="interactive-demo">
    <div class="controls">
      <button 
        @click="getInstance" 
        class="action-btn"
        :disabled="isAnimating"
      >
        Call Singleton.getInstance()
      </button>
      <button 
        @click="reset" 
        class="reset-btn"
        :disabled="isAnimating"
      >
        Reset
      </button>
    </div>

    <div class="canvas">
      <div class="scope client-scope">
        <span class="scope-label">Client Code</span>
        <div class="references">
          <div 
            v-for="(ref, i) in references" 
            :key="i"
            class="reference"
            :class="{ new: i === references.length - 1 }"
          >
            Ref #{{ i + 1 }}
          </div>
        </div>
      </div>

      <div class="scope class-scope">
        <span class="scope-label">Singleton Class (Static Scope)</span>
        <div class="static-field">
          <div class="field-label">private static instance: Singleton</div>
          <div class="field-value">
            <div 
              v-if="instance" 
              class="instance-obj"
              :class="{ 'just-created': justCreated }"
            >
              <span class="obj-id">@{{ instanceId }}</span>
            </div>
            <span v-else class="null-value">null</span>
          </div>
        </div>
      </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">
        > {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const instance = ref(false);
const instanceId = ref('');
const references = ref<number[]>([]);
const logs = ref<string[]>([]);
const isAnimating = ref(false);
const justCreated = ref(false);

const generateId = () => Math.random().toString(16).slice(2, 6).toUpperCase();

const getInstance = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  justCreated.value = false;

  logs.value.push('Calling getInstance()...');
  
  // Simulate delay for thought
  await new Promise(r => setTimeout(r, 600));

  if (!instance.value) {
    logs.value.push('Instance is null. Creating new instance...');
    await new Promise(r => setTimeout(r, 800));
    instance.value = true;
    instanceId.value = generateId();
    justCreated.value = true;
    logs.value.push(`Instance created: @${instanceId.value}`);
  } else {
    logs.value.push(`Instance exists (@${instanceId.value}). Returning it.`);
  }

  await new Promise(r => setTimeout(r, 500));
  references.value.push(1);
  logs.value.push('Client received reference.');
  isAnimating.value = false;
};

const reset = () => {
  instance.value = false;
  instanceId.value = '';
  references.value = [];
  logs.value = [];
  justCreated.value = false;
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
}

.controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.action-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  background: #cbd5e1;
  color: #334155;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.canvas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  min-height: 200px;
}

.scope {
  border: 2px dashed #94a3b8;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scope-label {
  position: absolute;
  top: -10px;
  left: 10px;
  background: #f8fafc;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.references {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.reference {
  background: #a5b4fc;
  color: #312e81;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.static-field {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.field-label {
  font-family: monospace;
  font-size: 0.8rem;
  color: #475569;
}

.field-value {
  width: 100px;
  height: 100px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: white;
}

.instance-obj {
  width: 80px;
  height: 80px;
  background: #4ade80;
  border-radius: 8px;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #064e3b;
  font-weight: bold;
}

.instance-obj.just-created {
  animation: create 0.5s ease-out;
}

.null-value {
  color: #94a3b8;
  font-style: italic;
}

.console {
  background: #1e293b;
  color: #22d3ee;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse; /* Newest at bottom visually, but we push to end. Wait, standard console is top down. Let's keep it standard. */
  flex-direction: column;
}

.log-entry {
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 0.1rem 0;
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes create {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(10deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
</style>
