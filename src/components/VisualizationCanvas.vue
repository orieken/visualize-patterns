<template>
  <div v-if="visualization" class="viz">
    <div class="viz-header">
      <p class="viz-title">{{ visualization.title }}</p>
      <p class="viz-subtitle">{{ visualization.summary }}</p>
    </div>

    <div v-if="visualization.type === 'graph'" class="graph">
      <div v-for="(layer, index) in layeredNodes" :key="index" class="graph-layer">
        <div v-for="node in layer" :key="node.id" class="graph-node" :class="{ highlight: highlightSet.has(node.id) }">
          {{ node.id }}
        </div>
      </div>
      <div class="order" aria-label="Traversal order">
        <span v-for="id in visualization.order" :key="id" class="order-chip">{{ id }}</span>
      </div>
    </div>

    <div v-else-if="visualization.type === 'bars'" class="bars">
      <div v-for="(value, index) in visualization.values" :key="index" class="bar" :style="{ height: `${value}%` }">
        <small>{{ value }}</small>
      </div>
      <div class="bar-steps">
        <span v-for="step in visualization.steps" :key="step" class="order-chip">{{ step }}</span>
      </div>
    </div>

    <div v-else-if="visualization.type === 'timeline'" class="timeline">
      <div v-for="(stage, index) in visualization.stages" :key="stage" class="timeline-step">
        <div class="dot"></div>
        <div class="timeline-content">
          <strong>Step {{ index + 1 }}</strong>
          <p>{{ stage }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="visualization.type === 'scatter'" class="scatter">
      <div class="plane">
        <div
          v-for="point in visualization.points"
          :key="point.label + point.x + point.y"
          class="dot"
          :class="normalizedCategory(point.category)"
          :style="{ left: `${point.x}%`, bottom: `${point.y}%` }"
          :title="`${point.label} (${point.category})`"
        >
          {{ point.label }}
        </div>
      </div>
      <div class="legend">
        <span v-for="category in scatterCategories" :key="category" class="legend-item">
          <span class="legend-dot" :class="normalizedCategory(category)"></span>{{ category }}
        </span>
      </div>
    </div>

    <div v-else-if="visualization.type === 'flow'" class="flow">
      <div v-for="(stage, index) in visualization.stages" :key="stage.title" class="flow-stage">
        <div class="flow-circle">{{ index + 1 }}</div>
        <div>
          <strong>{{ stage.title }}</strong>
          <p>{{ stage.detail }}</p>
        </div>
        <div v-if="index < visualization.stages.length - 1" class="flow-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visualization: {
    type: Object,
    default: null
  }
});

const layeredNodes = computed(() => {
  if (!props.visualization || props.visualization.type !== 'graph') return [];
  const layers = new Map();
  props.visualization.nodes.forEach(node => {
    const list = layers.get(node.layer) || [];
    list.push(node);
    layers.set(node.layer, list);
  });
  return Array.from(layers.entries())
    .sort(([a], [b]) => a - b)
    .map(([, nodes]) => nodes);
});

const highlightSet = computed(() => new Set(props.visualization?.order || []));
const scatterCategories = computed(() => {
  if (!props.visualization || props.visualization.type !== 'scatter') return [];
  const categories = new Set(props.visualization.points.map(point => point.category));
  return Array.from(categories.values());
});

const normalizedCategory = category => category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
</script>

<style scoped>
.viz {
  margin-top: 0.75rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.viz-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}

.viz-title {
  font-weight: 700;
  color: #0f172a;
}

.viz-subtitle {
  color: #0f172a;
  opacity: 0.75;
  font-size: 0.9rem;
}

.graph {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.graph-layer {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.graph-node {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(15, 23, 42, 0.1);
  color: #0f172a;
  font-weight: 600;
}

.graph-node.highlight {
  background: #c7d2fe;
  border-color: #312e81;
  color: #1e1b4b;
}

.order {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
}

.order-chip {
  background: #0f172a;
  color: #fff;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  letter-spacing: 0.01em;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
  height: 140px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #22d3ee, #2563eb);
  border-radius: 8px 8px 4px 4px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  min-width: 22px;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.18);
}

.bar small {
  margin-bottom: 6px;
}

.bar-steps {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.timeline-step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem;
  align-items: center;
}

.timeline-step .dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.timeline-content strong {
  color: #0f172a;
}

.scatter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scatter .plane {
  position: relative;
  height: 160px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px dashed rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.scatter .dot {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0f172a;
  background: #f8fafc;
  border: 2px solid #94a3b8;
  transform: translate(-50%, -50%);
}

.scatter .dot.supervised {
  border-color: #2563eb;
  color: #1d4ed8;
}

.scatter .dot.unsupervised {
  border-color: #10b981;
  color: #047857;
}

.scatter .dot.ensemble {
  border-color: #f97316;
  color: #c2410c;
}

.scatter .dot.rl {
  border-color: #8b5cf6;
  color: #5b21b6;
}

.scatter .dot.dimensionality-reduction {
  border-color: #0f172a;
}

.legend {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #0f172a;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: #94a3b8;
}

.legend-dot.supervised { background: #2563eb; }
.legend-dot.unsupervised { background: #10b981; }
.legend-dot.ensemble { background: #f97316; }
.legend-dot.rl { background: #8b5cf6; }
.legend-dot.dimensionality-reduction { background: #0f172a; }

.flow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.flow-stage {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.flow-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.flow-arrow {
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 800;
}
</style>
