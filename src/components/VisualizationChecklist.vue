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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const orderedItems = computed(() =>
  [...props.items].sort((a, b) => {
    if (a.domain === b.domain) return a.name.localeCompare(b.name);
    return a.domain.localeCompare(b.domain);
  })
);

const completed = computed(() => orderedItems.value.filter(item => Boolean(item.visualization)).length);
</script>
