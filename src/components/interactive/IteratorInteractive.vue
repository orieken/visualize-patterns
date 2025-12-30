<template>
  <div class="interactive-demo">
    <div class="controls">
      <div class="status-panel">
         <span>Collection: <strong>Playlist</strong></span>
         <span>Iterator: <strong>ShuffleIterator</strong></span>
      </div>
      <div class="actions">
         <button @click="nextTrack" class="action-btn" :disabled="isAnimating || !hasNext">
           ⏭ Next (iterator.next())
         </button>
         <button @click="reset" class="reset-btn">
           Reset
         </button>
      </div>
    </div>

    <div class="visualization-container">
       <div class="playlist">
          <div 
            v-for="song in playlist" 
            :key="song.id" 
            class="song-card"
            :class="{ active: currentSong?.id === song.id, handled: handledIds.has(song.id) }"
          >
             <div class="song-icon">{{ song.icon }}</div>
             <div class="song-info">
               <div class="song-title">{{ song.title }}</div>
               <div class="song-artist">{{ song.artist }}</div>
             </div>
             <div v-if="currentSong?.id === song.id" class="cursor-marker">
               🎧 Listening
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
import { ref, computed } from 'vue';

interface Song {
  id: number;
  title: string;
  artist: string;
  icon: string;
}

const rawSongs: Song[] = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', icon: '🎸' },
  { id: 2, title: 'Billie Jean', artist: 'Michael Jackson', icon: '🕺' },
  { id: 3, title: 'Smells Like Teen Spirit', artist: 'Nirvana', icon: '🤘' },
  { id: 4, title: 'Hotel California', artist: 'Eagles', icon: '🏨' },
  { id: 5, title: 'Rolling in the Deep', artist: 'Adele', icon: '🎤' }
];

// Iterator Logic
// We'll simulate a Shuffle Iterator which visits indices in random order
// but ensures all are visited once.
const playlist = ref<Song[]>([...rawSongs]);
const isAnimating = ref(false);
const logs = ref<string[]>(['Ready. Click Next to iterate through the playlist (Shuffle Mode).']);
const handledIds = ref<Set<number>>(new Set());
const currentSong = ref<Song | null>(null);

// Shuffle indices for the iterator logic
let visitOrder: number[] = [];
let currentIndex = -1;

const initIterator = () => {
   // Fisher-Yates shuffle for visit order
   const indices = rawSongs.map((_, i) => i);
   for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
   }
   visitOrder = indices;
   currentIndex = -1;
   handledIds.value.clear();
   currentSong.value = null;
   logs.value.push(`Iterator Initialized. Visit Order: [${visitOrder.join(', ')}]`);
};

initIterator();

const hasNext = computed(() => currentIndex < visitOrder.length - 1);

const nextTrack = async () => {
  if (isAnimating.value || !hasNext.value) return;
  isAnimating.value = true;
  
  currentIndex++;
  const targetIndex = visitOrder[currentIndex];
  const song = playlist.value[targetIndex];
  
  logs.value.push(`iterator.next() returned: "${song.title}"`);
  
  if (currentSong.value) {
    handledIds.value.add(currentSong.value.id);
  }
  currentSong.value = song;
  
  await delay(400);
  isAnimating.value = false;
  
  if (!hasNext.value) {
    logs.value.push("Iterator exhausted. No more tracks.");
  }
};

const reset = () => {
   initIterator();
   logs.value = ['Iterator reset. New shuffle order generated.'];
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

.status-panel {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) { background: #0284c7; }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-btn {
  background: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
}

.visualization-container {
  padding: 2rem;
  background: #f0f9ff;
  min-height: 300px;
  display: flex;
  justify-content: center;
}

.playlist {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.song-card {
  background: white;
  padding: 0.8rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #cbd5e1;
  transition: all 0.3s;
  position: relative;
}

.song-card.active {
  border-color: #0ea5e9;
  background: #e0f2fe;
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2);
  z-index: 10;
}

.song-card.handled {
  opacity: 0.6;
  background: #f1f5f9;
}

.song-icon { font-size: 1.5rem; }

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.song-title { font-weight: bold; font-size: 0.85rem; color: #334155; }
.song-artist { font-size: 0.7rem; color: #64748b; }

.cursor-marker {
  font-size: 0.65rem;
  background: #0ea5e9;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.console {
  background: #0f172a;
  color: #7dd3fc;
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
