<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="info">
         Chain of Responsibility: Pass request along a chain until handled.
      </div>
      <div class="actions">
         <button @click="sendRequest('basic')" :disabled="isAnimating">
           Send "Password Reset"
         </button>
         <button @click="sendRequest('complex')" :disabled="isAnimating">
           Send "Server Crash"
         </button>
         <button @click="sendRequest('billing')" :disabled="isAnimating">
           Send "Refund"
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="chain-wrapper">
          <div 
            v-for="(handler, idx) in handlers" 
            :key="handler.id" 
            class="handler-node"
            :class="{ active: currentHandlerIndex === idx, processed: processedHandlerIndex === idx }"
          >
             <div class="handler-avatar">{{ handler.avatar }}</div>
             <div class="handler-name">{{ handler.name }}</div>
             <div class="handler-role">{{ handler.role }}</div>
             
             <div v-if="idx < handlers.length - 1" class="link-arrow">⬇</div>
          </div>
       </div>

       <div class="request-object" :class="[requestStatus, { active: isAnimating }]" :style="requestStyle">
          <div class="req-icon">📩</div>
          <div class="req-label">{{ currentRequestLabel }}</div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Handler {
  id: string;
  name: string;
  role: string;
  avatar: string;
  canHandle: (type: string) => boolean;
}

const handlers: Handler[] = [
  { 
    id: 'bot', 
    name: 'AutoBot', 
    role: 'Triage', 
    avatar: '🤖',
    canHandle: (t) => t === 'basic' 
  },
  { 
    id: 'l1', 
    name: 'Alice', 
    role: 'L1 Support', 
    avatar: '👩‍💻',
    canHandle: (t) => t === 'billing' 
  },
  { 
    id: 'l2', 
    name: 'Bob', 
    role: 'SysAdmin', 
    avatar: '👨‍🔧',
    canHandle: (t) => t === 'complex' 
  },
  {
    id: 'manager',
    name: 'Karen',
    role: 'Manager',
    avatar: '👩‍💼',
    canHandle: () => true // Catch all
  }
];

const isAnimating = ref(false);
const currentHandlerIndex = ref<number | null>(null);
const processedHandlerIndex = ref<number | null>(null);
const currentRequestType = ref('');
const currentRequestLabel = ref('');
const requestStatus = ref<'idle' | 'moving' | 'handled' | 'unhandled'>('idle');
const logs = ref<string[]>(['Ready. Send a support ticket.']);

// Computes position for the floating request object
const requestStyle = computed(() => {
  if (currentHandlerIndex.value === null) return { opacity: 0 };
  
  // Calculate top position based on handler index (approximate based on CSS)
  // Each handler is ~80px height + 20px gap.
  const top = currentHandlerIndex.value * 100 + 40; 
  return {
    top: `${top}px`,
    opacity: 1
  };
});

const sendRequest = async (type: string) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentRequestType.value = type;
  currentRequestLabel.value = type === 'basic' ? 'Password?' : type === 'complex' ? 'Server Down!' : 'Refund?';
  
  processedHandlerIndex.value = null;
  logs.value.push(`New Request: "${currentRequestLabel.value}" (${type})`);

  for (let i = 0; i < handlers.length; i++) {
     currentHandlerIndex.value = i;
     const handler = handlers[i];
     
     logs.value.push(`${handler.name} received request...`);
     await delay(600);
     
     if (handler.canHandle(type)) {
       logs.value.push(`${handler.name}: "I can handle this."`);
       processedHandlerIndex.value = i;
       requestStatus.value = 'handled';
       await delay(500);
       logs.value.push(`Request processed by ${handler.role}.`);
       break;
     } else {
       logs.value.push(`${handler.name}: "Not my job. Passing to next."`);
     }
     
     if (i === handlers.length - 1) {
       logs.value.push('End of chain. Request handled by default (Manager).');
        processedHandlerIndex.value = i;
       requestStatus.value = 'handled';
     }
     
     await delay(300);
  }

  await delay(1000);
  isAnimating.value = false;
  currentHandlerIndex.value = null;
  requestStatus.value = 'idle';
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
  max-width: 40%;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #6366f1; /* Indigo */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.action-btn:hover:not(:disabled) { background: #4f46e5; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.visualization-container {
  display: flex;
  justify-content: center;
  position: relative;
  padding: 2rem;
  height: 450px; /* Taller for vertical chain */
  background: #f1f5f9;
  overflow-y: auto;
}

.chain-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.handler-node {
  background: white;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 180px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.handler-node.active {
  border-color: #6366f1;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.handler-node.processed {
  background: #ecfdf5;
  border-color: #10b981;
}

.handler-avatar { font-size: 1.5rem; }
.handler-name { font-weight: bold; font-size: 0.85rem; color: #334155; }
.handler-role { font-size: 0.7rem; color: #64748b; }

.link-arrow {
  position: absolute;
  bottom: -24px;
  color: #94a3b8;
  font-size: 1.2rem;
}

.request-object {
  position: absolute;
  left: 55%; /* Offset to right of chain */
  background: #fcd34d;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: top 0.5s ease-in-out, opacity 0.3s;
  z-index: 10;
  pointer-events: none;
}

.request-object.handled {
  background: #86efac; /* Green */
}

.req-icon { font-size: 1.2rem; }
.req-label { font-weight: bold; font-size: 0.75rem; color: #451a03; }

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
</style>
