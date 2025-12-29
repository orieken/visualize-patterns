<template>
  <div class="layout">
    <header class="topbar">
      <RouterLink to="/" class="brand">Visualize Patterns</RouterLink>
      <nav class="nav">
        <RouterLink to="/dsa">DS&A</RouterLink>
        <RouterLink to="/patterns">Gang of Four</RouterLink>
        <RouterLink to="/ml-ai">ML & AI</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
