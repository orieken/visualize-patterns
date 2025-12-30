<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="info">
         Proxy Pattern: Managing access (Caching) to an expensive resource.
      </div>
      <div class="actions">
         <button @click="requestImage('image-1.jpg')" class="action-btn" :disabled="isAnimating">
           Get Image 1
         </button>
         <button @click="requestImage('image-2.jpg')" class="action-btn" :disabled="isAnimating">
           Get Image 2
         </button>
         <button @click="clearCache" class="reset-btn" :disabled="isAnimating">
           Clear Cache
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="client-side">
          <div class="user-avatar">👤</div>
          <div class="request-arrow" :class="{ active: isAnimating }">
             {{ statusText }}
          </div>
       </div>

       <div class="proxy-box">
          <div class="label">Caching Proxy</div>
          <div class="cache-store">
             <div class="cache-title">Internal Cache:</div>
             <div v-if="Object.keys(cache).length === 0" class="empty">Empty</div>
             <div v-for="(val, key) in cache" :key="key" class="cache-item">
                {{ key }}
             </div>
          </div>
       </div>

       <div class="server-box" :class="{ active: isFetching }">
          <div class="label">Real Subject (Server)</div>
          <div class="server-icon">☁️</div>
          <div v-if="isFetching" class="spinner">↻</div>
       </div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const cache = reactive<Record<string, boolean>>({});
const isAnimating = ref(false);
const isFetching = ref(false);
const statusText = ref('');
const logs = ref<string[]>(['Ready. Request an image. First load is slow, subsequent are fast.']);

const requestImage = async (filename: string) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  statusText.value = `Request: ${filename}`;
  logs.value.push(`Client: Requests '${filename}' from Proxy.`);

  await delay(500);

  if (cache[filename]) {
     logs.value.push(`Proxy: HIT! Found '${filename}' in cache.`);
     statusText.value = 'Returning Cached...';
     await delay(500);
     logs.value.push(`Proxy: Returned '${filename}' instantly.`);
  } else {
     logs.value.push(`Proxy: MISS! '${filename}' not in cache.`);
     logs.value.push(`Proxy: Forwarding request to Real Subject (Server)...`);
     
     isFetching.value = true;
     statusText.value = 'Fetching from Server...';
     
     // Simulate network
     await delay(1500);
     
     isFetching.value = false;
     logs.value.push(`Server: Image data returned.`);
     
     // Store in cache
     cache[filename] = true;
     logs.value.push(`Proxy: Stored '${filename}' in cache.`);
     statusText.value = 'Returning Fresh...';
     
     await delay(500);
     logs.value.push(`Proxy: Returned '${filename}'.`);
  }
  
  statusText.value = 'Done';
  isAnimating.value = false;
};

const clearCache = () => {
  Object.keys(cache).forEach(key => delete cache[key]);
  logs.value.push('Cache cleared.');
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
  background: #ec4899; /* Pink */
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #db2777; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  height: 250px;
  background: #fdf2f8; /* Light Pink bg */
}

.client-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 120px;
}

.user-avatar { font-size: 2.5rem; }

.request-arrow {
  font-family: monospace;
  font-size: 0.7rem;
  color: #94a3b8;
  background: #e2e8f0;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
  text-align: center;
}

.request-arrow.active {
  background: #fbcfe8;
  color: #be185d;
  font-weight: bold;
}

.proxy-box {
  width: 140px;
  height: 160px;
  background: white;
  border: 3px solid #ec4899;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  position: relative;
  z-index: 2;
}

.proxy-box .label {
  font-size: 0.7rem;
  font-weight: bold;
  color: #db2777;
  border-bottom: 2px solid #fbcfe8;
  width: 100%;
  text-align: center;
  padding-bottom: 0.2rem;
  margin-bottom: 0.5rem;
}

.cache-store {
  width: 100%;
  flex: 1;
  background: #fce7f3;
  border-radius: 4px;
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cache-title { font-size: 0.6rem; color: #9d174d; font-weight: bold; }
.empty { font-size: 0.6rem; color: #be185d; font-style: italic; text-align: center; margin-top: 1rem; }

.cache-item {
  background: white;
  font-size: 0.6rem;
  padding: 0.2rem;
  border-radius: 2px;
  border: 1px solid #fbcfe8;
  color: #831843;
}

.server-box {
  width: 120px;
  height: 120px;
  background: #e2e8f0;
  border: 2px dashed #94a3b8;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.3s;
}

.server-box.active {
  opacity: 1;
  background: #cbd5e1;
  border-color: #64748b;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.server-box .label { font-size: 0.65rem; font-weight: bold; margin-bottom: 0.2rem; }
.server-icon { font-size: 2rem; }

.spinner {
  animation: spin 1s linear infinite;
  font-size: 1.2rem;
  margin-top: 0.2rem;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

.console {
  background: #0f172a;
  color: #f472b6;
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
