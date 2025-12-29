<template>
  <section class="checklist">
    <div class="checklist-header">
      <div class="heading">
        <p v-if="title" class="eyebrow">{{ title }}</p>
        <h3>Visualization coverage</h3>
      </div>
      <div class="controls">
        <div class="filters">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            class="filter-button"
            :class="{ active: filter.value === activeFilter }"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="pill">
          <span class="pill-dot"></span>
          {{ completed }} / {{ filteredItems.length }} completed
        </div>
      </div>
    </div>

    <div class="checklist-grid">
      <RouterLink
        v-for="item in filteredItems"
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
import { computed, ref } from 'vue';
import type { CatalogItem, Domain } from '../types/catalog';

type FilterValue = 'all' | Domain;

const props = withDefaults(defineProps<{ items: CatalogItem[]; title?: string }>(), { items: () => [] });

const domains = computed<Domain[]>(() => Array.from(new Set(props.items.map(item => item.domain))));
const filters = computed<{ value: FilterValue; label: string }[]>(() => [
  { value: 'all' as const, label: 'All' },
  ...domains.value.map(domain => ({ value: domain, label: domain }))
]);

const activeFilter = ref<FilterValue>('all');

const orderedItems = computed<CatalogItem[]>(() =>
  [...props.items].sort((a, b) => {
    if (a.domain === b.domain) return a.name.localeCompare(b.name);
    return a.domain.localeCompare(b.domain);
  })
);

const filteredItems = computed<CatalogItem[]>(() =>
  activeFilter.value === 'all'
    ? orderedItems.value
    : orderedItems.value.filter(item => item.domain === activeFilter.value)
);

const completed = computed<number>(() => filteredItems.value.filter(item => Boolean(item.visualization)).length);
</script>
