<template>
  <main class="detail">
    <RouterLink to="/" class="back">← Back to overview</RouterLink>

    <section v-if="item" class="detail-card">
      <p class="eyebrow">{{ item.domain }}</p>
      <h1>{{ item.name }}</h1>
      <p class="meta" v-if="item.complexity">Complexity: {{ item.complexity }}</p>
      <p class="meta" v-else-if="item.type">Type: {{ item.type }}</p>
      <p class="meta" v-else>Category: {{ item.category || 'Pattern' }}</p>
      <p class="description">{{ item.idea || item.intent }}</p>

      <div v-if="item.explanation" class="explanation">
        <h3>Plain English Explanation</h3>
        <p class="explanation-text">{{ item.explanation }}</p>
      </div>

      <VisualizationCanvas v-if="item.visualization" :visualization="item.visualization" />
      <div v-else class="pending">
        <p>Visualization pending — marked on the checklist for implementation.</p>
      </div>
    </section>

    <section v-else class="detail-card">
      <h1>Not found</h1>
      <p>We couldn't locate that visualization. Choose another item from the home view.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import VisualizationCanvas from '../components/VisualizationCanvas.vue';
import type { CatalogItem } from '../types/catalog';
import { allItems } from '../assets/data/catalog';

const route = useRoute();

const slugParam = computed(() => {
  const param = route.params.slug;
  return typeof param === 'string' ? param : Array.isArray(param) ? param[0] : undefined;
});

const item = computed<CatalogItem | undefined>(() =>
  allItems.find(entry => entry.slug === slugParam.value)
);
</script>
