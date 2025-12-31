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
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
    border-radius: var(--radius-btn);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.2s;
    height: 36px;
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.theme-toggle:hover {
    background: var(--primary);
    color: white;
}
</style>
