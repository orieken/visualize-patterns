<template>
  <main>
    <section class="hero">
      <h1>Gang of Four Patterns</h1>
      <p>Spot intent, structure, and variation of the classic design patterns.</p>
      <div class="callouts">
        <div class="callout">Bridge diagrams and flows to contrast responsibilities.</div>
        <div class="callout">Checklist marks which patterns already have visuals.</div>
        <div class="callout">Each card deep-links to a focused visualization view.</div>
      </div>
    </section>

    <VisualizationChecklist :items="designPatterns" title="Design pattern visualization checklist" />

    <SectionGrid
      title="Gang of Four"
      subtitle="Design patterns"
      description="Capture each pattern's intent in a single card for rapid comparison."
      :items="designPatterns"
    />
  </main>
</template>

<script setup lang="ts">
import SectionGrid from '../components/SectionGrid.vue';
import VisualizationChecklist from '../components/VisualizationChecklist.vue';
import { designPatterns } from '../assets/data/catalog';
</script>
