<template>
  <section class="section">
    <h2>
      <span class="badge">{{ title }}</span>
      <span>{{ subtitle }}</span>
    </h2>
    <p class="meta">{{ description }}</p>
    <div class="grid">
      <article v-for="item in items" :key="item.name" class="card">
        <header style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
          <strong>{{ item.name }}</strong>
          <span v-if="item.category || item.type" class="badge">{{ item.category || item.type }}</span>
        </header>
        <p v-if="item.complexity" class="meta">Complexity: {{ item.complexity }}</p>
        <p class="description">{{ item.idea || item.intent }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  description: String,
  items: {
    type: Array,
    default: () => []
  }
});
</script>
