<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
        <label>Send Message As:</label>
        <div class="btn-group">
          <button @click="send(alice)" :disabled="isAnimating">Alice</button>
          <button @click="send(bob)" :disabled="isAnimating">Bob</button>
          <button @click="send(charlie)" :disabled="isAnimating">Charlie</button>
        </div>
      </div>
    </div>

    <div class="visualization-container">
       <div class="user-nodes">
          <div class="user-node" :class="{ active: activeSender === 'Alice' }">
             <div class="avatar">👩</div>
             <div>Alice</div>
             <div class="msg-bubble" v-if="alice.lastMsg">{{ alice.lastMsg }}</div>
          </div>
          
          <div class="spacing-for-hub"></div>

          <div class="user-node" :class="{ active: activeSender === 'Bob' }">
             <div class="avatar">👨</div>
             <div>Bob</div>
             <div class="msg-bubble" v-if="bob.lastMsg">{{ bob.lastMsg }}</div>
          </div>
       </div>

       <!-- The Mediator Hub in center -->
       <div class="hub-container">
          <div class="hub" :class="{ active: isAnimating }">
             <div class="hub-icon">📡</div>
             <div class="hub-label">ChatMediator</div>
          </div>
       </div>

       <div class="user-nodes bottom">
         <div class="user-node" :class="{ active: activeSender === 'Charlie' }">
             <div class="avatar">👴</div>
             <div>Charlie</div>
             <div class="msg-bubble" v-if="charlie.lastMsg">{{ charlie.lastMsg }}</div>
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

interface User {
  name: string;
  lastMsg: string;
}

const alice = reactive<User>({ name: 'Alice', lastMsg: '' });
const bob = reactive<User>({ name: 'Bob', lastMsg: '' });
const charlie = reactive<User>({ name: 'Charlie', lastMsg: '' });

const activeSender = ref<string | null>(null);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Users talk to the Mediator, which broadcasts to others.']);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const messages = [
  "Hello everyone!",
  "Did you see the game?",
  "Visualizing patterns is fun.",
  "Who is the Mediator?",
  "I am hungry."
];

const send = async (sender: User) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  activeSender.value = sender.name;
  
  const text = messages[Math.floor(Math.random() * messages.length)];
  
  // 1. Sender sends to Mediator
  logs.value.push(`${sender.name} sends: "${text}" -> Mediator`);
  // Clear others' bubbles for clarity
  alice.lastMsg = '';
  bob.lastMsg = '';
  charlie.lastMsg = '';
  
  await delay(400);
  
  // 2. Mediator processes
  activeSender.value = 'Mediator'; // Highlight hub conceptually
  logs.value.push(`Mediator: Received message. Broadcasting to colleagues...`);
  
  await delay(500);
  
  // 3. Mediator broadcasts to others
  if (sender !== alice) alice.lastMsg = text;
  if (sender !== bob) bob.lastMsg = text;
  if (sender !== charlie) charlie.lastMsg = text;
  
  logs.value.push(`Mediator -> [${sender !== alice ? 'Alice, ' : ''}${sender !== bob ? 'Bob, ' : ''}${sender !== charlie ? 'Charlie' : ''}]`);
  
  await delay(800);
  
  activeSender.value = null;
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
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: center;
}

.panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.panel label {
  font-weight: bold;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-group button {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  color: #334155;
  font-weight: 500;
}

.btn-group button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.visualization-container {
  position: relative;
  height: 350px;
  background: #fdf4ff; /* Light Pink/Purple bg */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.user-nodes {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 4rem;
}

.user-nodes.bottom {
  justify-content: center;
}

.user-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.3s;
}

.user-node.active .avatar {
  transform: scale(1.2);
  border-color: #d946ef;
  box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
}

.avatar {
  font-size: 2rem;
  background: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #cbd5e1;
  transition: all 0.3s;
  z-index: 2;
}

.msg-bubble {
  position: absolute;
  top: -40px;
  background: #fff;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.msg-bubble::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: white;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
}

.hub-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hub {
  width: 80px;
  height: 80px;
  background: #0f172a;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
  border: 2px solid #4ade80; /* Neutral, turns green on active? */
  transition: all 0.3s;
}

.hub.active {
  background: #4ade80; /* Active Green */
  color: #064e3b;
  border-color: #22c55e;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.hub-icon { font-size: 1.8rem; }
.hub-label { font-size: 0.6rem; font-weight: bold; margin-top: 0.2rem; }

.console {
  background: #0f172a;
  color: #c084fc;
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

@keyframes pop-in {
  from { opacity: 0; transform: translateY(10px) scale(0.8); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
