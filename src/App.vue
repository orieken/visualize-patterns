<template>
  <main>
    <section class="hero">
      <h1>Algorithms & Patterns Visualizer</h1>
      <p>Study common data structures & algorithms, the Gang of Four design patterns, and core ML/AI methods.</p>
      <div class="callouts">
        <div class="callout">Visual flashcards summarizing intent, complexity, and intuition.</div>
        <div class="callout">Curated for teaching and quick review sessions.</div>
        <div class="callout">Built with Vue 3, Vite, Vitest, and Cucumber.js for living examples.</div>
      </div>
    </section>

    <SectionGrid
      title="DS&A"
      subtitle="Algorithm cheat-sheets"
      description="Quick reminders of runtime and core ideas for classic interview-ready algorithms."
      :items="dsaAlgorithms"
    />

    <SectionGrid
      title="Gang of Four"
      subtitle="Design patterns"
      description="Capture each pattern's intent in a single card for rapid comparison."
      :items="designPatterns"
    />

    <SectionGrid
      title="ML & AI"
      subtitle="Model intuition"
      description="Anchor ML study sessions with concise mental models for common learners."
      :items="mlAlgorithms"
    />
  </main>
</template>

<script setup>
import SectionGrid from './components/SectionGrid.vue';
import { dsaAlgorithms, designPatterns, mlAlgorithms } from './assets/data/catalog';
</script>
