<template>
  <main>
    <section class="hero">
      <h1>Data Structures & Algorithms</h1>
      <p>Interactive mini-visuals for the most common interview-ready algorithms.</p>
      <div class="callouts">
        <div class="callout">Trace each algorithm step-by-step with highlights.</div>
        <div class="callout">Shuffle, sort, and traverse to feel the runtime.</div>
        <div class="callout">Deep-link into any visualization card for teaching.</div>
      </div>
    </section>

    <VisualizationChecklist :items="dsaAlgorithms" title="DS&A visualization checklist" />

    <SectionGrid
      title="DS&A"
      subtitle="Algorithm cheat-sheets"
      description="Quick reminders of runtime and core ideas for classic interview-ready algorithms."
      :items="dsaAlgorithms"
    />
  </main>
</template>

<script setup lang="ts">
import SectionGrid from '../components/SectionGrid.vue';
import VisualizationChecklist from '../components/VisualizationChecklist.vue';
import { dsaAlgorithms } from '../assets/data/catalog';
</script>
