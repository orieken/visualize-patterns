<template>
  <section class="section">
    <h2>
      <span class="badge">{{ title }}</span>
      <span>{{ subtitle }}</span>
    </h2>
    <p class="meta">{{ description }}</p>
    <div class="grid">
      <article v-for="item in items" :key="item.name" class="card">
        <RouterLink class="card-link" :to="{ name: 'visualization', params: { slug: item.slug } }">
          <header class="card-header">
            <div>
              <strong>{{ item.name }}</strong>
              <p v-if="item.complexity" class="meta">Complexity: {{ item.complexity }}</p>
            </div>
            <span v-if="item.category || item.type" class="badge">{{ item.category || item.type }}</span>
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
</script>
