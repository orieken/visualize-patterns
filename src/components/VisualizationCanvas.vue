<template>
  <div v-if="visualization" class="viz">
    <div class="viz-header">
      <p class="viz-title">{{ visualization.title }}</p>
      <p class="viz-subtitle">{{ visualization.summary }}</p>
    </div>

    <div v-if="maxStep > 0" class="controls" aria-label="Visualization controls">
      <div class="buttons">
        <button type="button" class="pill" @click="previous" :disabled="stepIndex === 0">Previous</button>
        <button type="button" class="pill" @click="togglePlay">{{ playing ? 'Pause' : 'Auto-play' }}</button>
        <button type="button" class="pill" @click="next" :disabled="stepIndex >= maxStep - 1">Next</button>
      </div>
      <div class="slider" v-if="maxStep > 1">
        <input
          v-model.number="stepIndex"
          type="range"
          min="0"
          :max="maxStep - 1"
          :aria-valuetext="`Step ${stepIndex + 1} of ${maxStep}`"
        />
        <span class="slider-label">Step {{ stepIndex + 1 }} / {{ maxStep }}</span>
        <span class="step-hint">{{ currentStepLabel }}</span>
      </div>
    </div>

    <div v-if="visualization.type === 'graph'" class="graph">
      <div v-for="(layer, index) in layeredNodes" :key="index" class="graph-layer">
        <button
          v-for="node in layer"
          :key="node.id"
          type="button"
          class="graph-node"
          :class="{ highlight: highlightSet.has(node.id) }"
          @click="jumpToNode(node.id)"
        >
          {{ node.id }}
        </button>
      </div>
      <div class="order" aria-label="Traversal order">
        <span v-for="id in visualization.order" :key="id" class="order-chip">{{ id }}</span>
      </div>
    </div>

    <div v-else-if="visualization.type === 'bars'" class="bars">
      <div
        v-for="(value, index) in displayedBars"
        :key="index"
        class="bar"
        :class="{ active: index < barHighlightCount }"
        :style="{ height: `${value}%` }"
      >
        <small>{{ value }}</small>
      </div>
      <div class="bar-steps">
        <span v-for="step in visualization.steps" :key="step" class="order-chip">{{ step }}</span>
      </div>
      <div class="bar-actions">
        <button type="button" class="pill" @click="shuffleBars">Shuffle</button>
        <button type="button" class="pill" @click="sortBars">Sort snapshot</button>
      </div>
    </div>

    <div v-else-if="visualization.type === 'timeline'" class="timeline">
      <div v-for="(stage, index) in visualization.stages" :key="stage" class="timeline-step" :class="{ active: index === stepIndex }">
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
          :class="[normalizedCategory(point.category), { muted: !isScatterActive(point) }]"
          :style="{ left: `${point.x}%`, bottom: `${point.y}%` }"
          :title="`${point.label} (${point.category})`"
        >
          {{ point.label }}
        </div>
      </div>
      <div class="legend">
        <span v-for="category in scatterCategories" :key="category" class="legend-item" :class="{ active: category === activeScatterCategory }">
          <button type="button" class="legend-button" @click="setScatterCategory(category)">
            <span class="legend-dot" :class="normalizedCategory(category)"></span>{{ category }}
          </button>
        </span>
      </div>
    </div>

    <div v-else-if="visualization.type === 'flow'" class="flow">
      <div v-for="(stage, index) in visualization.stages" :key="stage.title" class="flow-stage" :class="{ active: index === stepIndex }">
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

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import type { CatalogItem, GraphNode, ScatterPoint, Visualization } from '../types/catalog';

const props = defineProps<{ visualization?: Visualization }>();

const stepIndex = ref(0);
const playing = ref(false);
const barState = ref<number[]>([]);
const activeScatterCategory = ref<string | null>(null);
let intervalId: ReturnType<typeof setInterval> | null = null;

const visualization = computed(() => props.visualization);

const scatterCategories = computed<string[]>(() => {
  if (!props.visualization || props.visualization.type !== 'scatter') return [];
  const categories = new Set(props.visualization.points.map((point: ScatterPoint) => point.category));
  return Array.from(categories.values());
});

const maxStep = computed<number>(() => {
  if (!visualization.value) return 0;
  if (visualization.value.type === 'graph') return visualization.value.order.length;
  if (visualization.value.type === 'bars') return Math.max(visualization.value.steps.length, visualization.value.values.length);
  if (visualization.value.type === 'timeline' || visualization.value.type === 'flow') return visualization.value.stages.length;
  if (visualization.value.type === 'scatter') return scatterCategories.value.length || visualization.value.points.length;
  return 0;
});

const resetControls = (): void => {
  stepIndex.value = 0;
  playing.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

watch(
  () => props.visualization,
  vis => {
    resetControls();
    if (vis?.type === 'bars') {
      barState.value = [...vis.values];
    } else {
      barState.value = [];
    }
    if (vis?.type === 'scatter') {
      activeScatterCategory.value = scatterCategories.value[0] ?? null;
    } else {
      activeScatterCategory.value = null;
    }
  },
  { immediate: true }
);

const layeredNodes = computed<GraphNode[][]>(() => {
  if (!props.visualization || props.visualization.type !== 'graph') return [];
  const layers = new Map<number, GraphNode[]>();
  props.visualization.nodes.forEach(node => {
    const list = layers.get(node.layer) || [];
    list.push(node);
    layers.set(node.layer, list);
  });
  return Array.from(layers.entries())
    .sort(([a], [b]) => a - b)
    .map(([, nodes]) => nodes);
});

const highlightSet = computed(() => {
  if (!props.visualization || props.visualization.type !== 'graph') return new Set<string>();
  const { order } = props.visualization;
  const limit = Math.min(stepIndex.value + 1, order.length);
  return new Set(order.slice(0, limit));
});

const normalizedCategory = (category: CatalogItem['domain'] | string): string =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const currentStepLabel = computed(() => {
  const vis = visualization.value;
  if (!vis) return '';
  if (vis.type === 'graph') {
    const node = vis.order[stepIndex.value];
    return node ? `Visiting ${node}` : '';
  }
  if (vis.type === 'bars') return vis.steps[stepIndex.value] ?? 'Adjusting bars';
  if (vis.type === 'timeline' || vis.type === 'flow') return vis.stages[stepIndex.value] ?? '';
  if (vis.type === 'scatter') return activeScatterCategory.value ? `Highlighting ${activeScatterCategory.value}` : '';
  return '';
});

const setStep = (value: number): void => {
  stepIndex.value = Math.min(Math.max(value, 0), Math.max(maxStep.value - 1, 0));
};

const next = (): void => {
  if (stepIndex.value < maxStep.value - 1) {
    stepIndex.value += 1;
  } else {
    playing.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};

const previous = (): void => setStep(stepIndex.value - 1);

const togglePlay = (): void => {
  if (maxStep.value <= 1) return;
  playing.value = !playing.value;
  if (playing.value) {
    intervalId = setInterval(() => {
      if (stepIndex.value >= maxStep.value - 1) {
        playing.value = false;
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        stepIndex.value += 1;
      }
    }, 1300);
  } else if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const jumpToNode = (id: string): void => {
  if (!props.visualization || props.visualization.type !== 'graph') return;
  const idx = props.visualization.order.indexOf(id);
  if (idx >= 0) setStep(idx);
};

const displayedBars = computed<number[]>(() => {
  if (!props.visualization || props.visualization.type !== 'bars') return [];
  return barState.value.length ? barState.value : [...props.visualization.values];
});

const barHighlightCount = computed(() => {
  if (!props.visualization || props.visualization.type !== 'bars') return 0;
  return Math.min(stepIndex.value + 1, displayedBars.value.length);
});

const shuffleBars = (): void => {
  if (!props.visualization || props.visualization.type !== 'bars') return;
  barState.value = [...props.visualization.values].sort(() => Math.random() - 0.5);
};

const sortBars = (): void => {
  if (!props.visualization || props.visualization.type !== 'bars') return;
  barState.value = [...displayedBars.value].sort((a, b) => a - b);
};

const activeScatterCategoryValue = computed(() => activeScatterCategory.value);

const isScatterActive = (point: ScatterPoint): boolean => {
  if (!props.visualization || props.visualization.type !== 'scatter') return false;
  if (!activeScatterCategoryValue.value) return true;
  return point.category === activeScatterCategoryValue.value;
};

const setScatterCategory = (category: string): void => {
  activeScatterCategory.value = category;
  const index = scatterCategories.value.indexOf(category);
  if (index >= 0) setStep(index);
};

watch(maxStep, value => {
  if (stepIndex.value > value - 1) {
    stepIndex.value = Math.max(value - 1, 0);
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
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

.controls {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px dashed rgba(15, 23, 42, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  margin-bottom: 0.5rem;
}

.buttons {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.slider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.slider input[type='range'] {
  flex: 1;
  accent-color: #2563eb;
}

.slider-label {
  font-weight: 600;
  color: #0f172a;
}

.step-hint {
  color: #0f172a;
  opacity: 0.75;
}

.pill {
  border: none;
  background: #0f172a;
  color: #fff;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
}

.pill:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.pill:hover:not(:disabled) {
  background: #111827;
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
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.graph-node.highlight {
  background: #c7d2fe;
  border-color: #312e81;
  color: #1e1b4b;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(49, 46, 129, 0.18);
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

.bar.active {
  background: linear-gradient(180deg, #22c55e, #16a34a);
  box-shadow: 0 6px 14px rgba(34, 197, 94, 0.18);
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

.bar-actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
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

.timeline-step.active .dot {
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25);
}

.timeline-step.active .timeline-content {
  background: rgba(15, 23, 42, 0.04);
  padding: 0.35rem 0.5rem;
  border-radius: 10px;
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

.scatter .dot.muted {
  opacity: 0.25;
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

.legend-item.active .legend-button {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.45);
}

.legend-button {
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 0.2rem 0.6rem;
  background: #fff;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.legend-button:hover {
  border-color: #2563eb;
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
  border-radius: 10px;
  padding: 0.4rem 0.5rem;
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

.flow-stage.active {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.flow-arrow {
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 800;
}
</style>
