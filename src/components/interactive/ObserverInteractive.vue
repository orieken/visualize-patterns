<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="panel">
         <div class="channel-controls">
            <div class="channel-icon">📺</div>
            <div class="channel-info">
               <div class="channel-name">DevPattern Channel</div>
               <button @click="uploadVideo" class="action-btn" :disabled="isAnimating">
                 Upload New Video
               </button>
            </div>
         </div>
      </div>
      <button @click="reset" class="reset-btn">
         Reset Subscribers
      </button>
    </div>

    <div class="visualization-container">
       <div class="subscribers-grid">
         <div 
           v-for="sub in subscribers" 
           :key="sub.id" 
           class="subscriber"
           :class="{ active: sub.isNotified, subscribed: sub.isSubscribed }"
           @click="toggleSubscription(sub)"
         >
            <div class="sub-avatar">{{ sub.avatar }}</div>
            <div class="sub-name">{{ sub.name }}</div>
            <div class="sub-status" v-if="sub.isSubscribed">
               {{ sub.isNotified ? '🔔 Ding!' : 'Subscribed' }}
            </div>
            <div class="sub-status unsub" v-else>Unsubscribed</div>
            
            <div v-if="sub.notification" class="notification-toast">
               {{ sub.notification }}
            </div>
         </div>
       </div>

       <div class="hint">Click a user to Subscribe/Unsubscribe them.</div>
    </div>

    <div class="console">
      <div v-for="(log, i) in logs" :key="i" class="log-entry">> {{ log }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Subscriber {
  id: number;
  name: string;
  avatar: string;
  isSubscribed: boolean;
  isNotified: boolean;
  notification: string;
}

const subscribers = ref<Subscriber[]>([
  { id: 1, name: 'Alice', avatar: '👩‍💻', isSubscribed: true, isNotified: false, notification: '' },
  { id: 2, name: 'Bob', avatar: '👨‍🎨', isSubscribed: true, isNotified: false, notification: '' },
  { id: 3, name: 'Charlie', avatar: '🦸‍♂️', isSubscribed: false, isNotified: false, notification: '' },
  { id: 4, name: 'Dave', avatar: '🧟', isSubscribed: true, isNotified: false, notification: '' }
]);

const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Click users to toggle subscription. Click Upload to Notify.']);

const toggleSubscription = (sub: Subscriber) => {
  if (isAnimating.value) return;
  sub.isSubscribed = !sub.isSubscribed;
  logs.value.push(`${sub.name} ${sub.isSubscribed ? 'subscribed' : 'unsubscribed'}.`);
};

const uploadVideo = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  const videoTitle = `Pattern Tutorial #${Math.floor(Math.random() * 100)}`;
  logs.value.push(`Subject: Uploading "${videoTitle}"...`);
  
  await delay(600);
  
  logs.value.push(`Subject: Notifying all observers...`);
  
  // Notify loop
  let notificationCount = 0;
  for (const sub of subscribers.value) {
     if (sub.isSubscribed) {
        notifySubscriber(sub, videoTitle);
        notificationCount++;
        await delay(200);
     }
  }
  
  if (notificationCount === 0) {
    logs.value.push('No subscribers to notify.');
  } else {
    logs.value.push(`Notified ${notificationCount} subscribers.`);
  }

  await delay(1500);
  // Clear notifications
  subscribers.value.forEach(s => {
    s.isNotified = false;
    s.notification = '';
  });
  
  isAnimating.value = false;
};

const notifySubscriber = (sub: Subscriber, title: string) => {
   sub.isNotified = true;
   sub.notification = `New Video: ${title}`;
   logs.value.push(`Observer (${sub.name}): Update received.`);
};

const reset = () => {
  subscribers.value.forEach(s => {
    s.isSubscribed = true;
    s.isNotified = false;
    s.notification = '';
  });
  subscribers.value[2].isSubscribed = false; // Charlie default unsub
  logs.value = ['Reset.'];
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
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.channel-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.channel-icon {
  font-size: 2.5rem;
  background: #ef4444;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.channel-name { font-weight: 800; color: #1e293b; font-size: 1.1rem; }

.action-btn {
  background: #ef4444; /* YouTube Red */
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.action-btn:hover:not(:disabled) { background: #dc2626; }
.action-btn:disabled { opacity: 0.5; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  padding: 2rem;
  background: #fff1f2; /* Light red/pink */
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.subscribers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.subscriber {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.subscriber.subscribed {
  border-color: #ef4444;
}

.subscriber.active {
  background: #fef2f2;
  transform: translateY(-5px);
  box-shadow: 0 8px 12px -2px rgba(239, 68, 68, 0.2);
}

.sub-avatar { font-size: 2.5rem; margin-bottom: 0.5rem; }
.sub-name { font-weight: 600; color: #334155; }
.sub-status { font-size: 0.7rem; color: #ef4444; font-weight: bold; margin-top: 0.2rem; }
.sub-status.unsub { color: #94a3b8; }

.notification-toast {
  position: absolute;
  top: -20px;
  background: #10b981;
  color: white;
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: float-up 0.5s ease-out;
}

.hint {
  font-size: 0.8rem;
  color: #94a3b8;
  font-style: italic;
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

@keyframes float-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
