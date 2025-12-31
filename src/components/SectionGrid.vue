<template>
  <section class="section">
    <h2>
      <span class="badge">{{ title }}</span>
      <span>{{ subtitle }}</span>
    </h2>
    <p class="meta">{{ description }}</p>
    <div class="grid">
      <article v-for="item in items" :key="item.name" class="card" :class="{ 'card-mastered': isMastered(item.slug!) }">
        <div class="card-controls">
            <button 
                class="mastery-toggle" 
                :class="{ active: isMastered(item.slug!) }"
                @click.prevent="toggleMastery(item.slug!)"
                title="Mark as Mastered"
            >
                <span v-if="isMastered(item.slug!)">🏆</span>
                <span v-else>⚪</span>
            </button>
        </div>
        <RouterLink class="card-link" :to="{ name: 'visualization', params: { slug: item.slug } }">
          <header class="card-header">
            <div class="header-main">
              <h3 class="card-title">{{ item.name }}</h3>
              <span v-if="item.category || item.type" class="badge">{{ item.category || item.type }}</span>
            </div>
            <p v-if="item.complexity" class="meta-tag">Complexity: {{ item.complexity }}</p>
          </header>
          <p class="description">{{ item.idea || item.intent }}</p>
          <VisualizationCanvas v-if="item.visualization" :visualization="item.visualization" />
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import VisualizationCanvas from './VisualizationCanvas.vue';
import type { CatalogItem } from '../types/catalog';
import { useProgress } from '../composables/useProgress';

withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    description: string;
    items: CatalogItem[];
  }>(),
  {
    items: () => []
  }
);

const { toggleMastery, isMastered } = useProgress();
</script>

<style scoped>
.card {
    position: relative;
    transition: all 0.3s ease;
}

.card-mastered {
    border-color: #22c55e;
    background: linear-gradient(to bottom right, var(--card-bg), rgba(34, 197, 94, 0.05));
    box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1);
}

.card-controls {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
}

.mastery-toggle {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.2s, transform 0.2s;
    filter: grayscale(100%);
}

.mastery-toggle:hover {
    opacity: 1;
    transform: scale(1.1);
}

.mastery-toggle.active {
    opacity: 1;
    filter: none;
}
.card-header {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.header-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}

.card-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
}

.badge {
    font-size: 0.7rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary);
    font-weight: 600;
    white-space: nowrap;
}

.meta-tag {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0;
    background: rgba(0,0,0,0.03);
    align-self: flex-start;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
}

.description {
    color: var(--text-muted);
    font-size: 0.95rem;
    margin-bottom: 1rem;
    flex: 1;
    line-height: 1.5;
}
</style>
