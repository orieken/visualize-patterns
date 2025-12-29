<template>
  <section class="checklist">
    <div class="checklist-header">
      <div>
        <p class="eyebrow">Visualization checklist</p>
        <h3>Track coverage across domains</h3>
        <p class="meta">Every item gets a dedicated route; checked rows already have a mini-visual in place.</p>
      </div>
      <div class="pill">
        <span class="pill-dot"></span>
        {{ completed }} / {{ items.length }} completed
      </div>
    </div>

    <div class="checklist-grid">
      <RouterLink
        v-for="item in orderedItems"
        :key="item.slug"
        class="checklist-row"
        :class="{ done: Boolean(item.visualization) }"
        :to="{ name: 'visualization', params: { slug: item.slug } }"
      >
        <div class="status">
          <input type="checkbox" :checked="Boolean(item.visualization)" disabled />
          <div>
            <p class="eyebrow">{{ item.domain }}</p>
            <strong>{{ item.name }}</strong>
          </div>
        </div>
        <span class="badge">{{ item.category || item.type || 'Pattern' }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CatalogItem } from '../types/catalog';

const props = withDefaults(defineProps<{ items: CatalogItem[] }>(), { items: () => [] });

const orderedItems = computed<CatalogItem[]>(() =>
  [...props.items].sort((a, b) => {
    if (a.domain === b.domain) return a.name.localeCompare(b.name);
    return a.domain.localeCompare(b.domain);
  })
);

const completed = computed<number>(() => orderedItems.value.filter(item => Boolean(item.visualization)).length);
</script>
