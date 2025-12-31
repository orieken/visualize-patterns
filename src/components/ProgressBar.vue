<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    total: number;
    completed: number;
    color?: string; // e.g. 'var(--primary)' or hex
}>();

const percentage = computed(() => {
    if (props.total === 0) return 0;
    return Math.min(100, Math.max(0, (props.completed / props.total) * 100));
});

const progressColor = computed(() => props.color || 'var(--primary)');
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: percentage + '%', backgroundColor: progressColor }"
      ></div>
    </div>
    <div class="progress-text">
      {{ completed }} / {{ total }} Completed ({{ Math.round(percentage) }}%)
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-bar {
  height: 12px;
  background: rgba(0,0,0,0.1);
  border-radius: 999px; /* Pill shape */
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.progress-fill {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 999px;
  /* Add subtle shine effect */
  background-image: linear-gradient(
    45deg, 
    rgba(255,255,255,0.15) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255,255,255,0.15) 50%, 
    rgba(255,255,255,0.15) 75%, 
    transparent 75%, 
    transparent
  );
  background-size: 1rem 1rem;
}

.progress-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-align: right;
}
</style>
