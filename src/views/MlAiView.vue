<template>
  <main>
    <section class="hero">
      <h1>Machine Learning & AI</h1>
      <p>Summaries and intuitive sketches for foundational ML and AI techniques.</p>
      <div class="callouts">
        <div class="callout">Compare optimizers, learners, and neural nets side-by-side.</div>
        <div class="callout">Timeline and flow visuals focus on the learning loop.</div>
        <div class="callout">Use the checklist to spot gaps and prioritize new sketches.</div>
      </div>
    </section>

    <VisualizationChecklist :items="mlAlgorithms" title="ML & AI visualization checklist" />

    <SectionGrid
      title="ML & AI"
      subtitle="Model intuition"
      description="Anchor ML study sessions with concise mental models for common learners."
      :items="mlAlgorithms"
    />
  </main>
</template>

<script setup lang="ts">
import SectionGrid from '../components/SectionGrid.vue';
import VisualizationChecklist from '../components/VisualizationChecklist.vue';
import { mlAlgorithms } from '../assets/data/catalog';
</script>
