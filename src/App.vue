<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
        <div class="header-inner">
            <RouterLink to="/" class="logo">
                <span class="logo-icon">🧩</span>
                <span class="logo-text">PatternVisualizer</span>
            </RouterLink>
            
            <nav class="app-nav">
                <RouterLink to="/" class="nav-link">Academy</RouterLink>
                <RouterLink to="/playground" class="nav-link">Playground</RouterLink>
                <div class="divider"></div>
                <ThemeSwitcher />
            </nav>
        </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 64px;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-app);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
}
[data-theme="dark"] .app-header {
    background: rgba(31, 31, 31, 0.8);
}

.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    text-decoration: none;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.app-nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-link {
    text-decoration: none;
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s;
}

.nav-link:hover, .nav-link.router-link-active {
    color: var(--primary);
}

.divider {
    width: 1px;
    height: 24px;
    background: var(--card-border);
}

.app-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
}
</style>
