<script setup lang="ts">
import { ref, onMounted } from 'vue';

const theme = ref('modern'); // 'modern' | 'playful'

const toggleTheme = () => {
    theme.value = theme.value === 'modern' ? 'playful' : 'modern';
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};

onMounted(() => {
    const saved = localStorage.getItem('theme') || 'modern';
    theme.value = saved;
    document.documentElement.setAttribute('data-theme', saved);
});
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="theme === 'modern'">🎨 Switch to Playful</span>
    <span v-else>👔 Switch to Modern</span>
  </button>
</template>

<style scoped>
.theme-toggle {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.25rem;
    background: var(--card-bg);
    border: 2px solid var(--primary);
    color: var(--primary);
    border-radius: var(--radius-btn);
    cursor: pointer;
    font-weight: bold;
    box-shadow: var(--shadow-card);
    z-index: 1000;
    transition: transform 0.2s;
}
.theme-toggle:hover {
    transform: translateY(-2px);
}
</style>
