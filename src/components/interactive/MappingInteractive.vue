<template>
  <div class="mapping-viz">
    <div class="controls">
       <div class="status">
           <div>Injective (1-to-1): <span :class="{ pass: isInjective }">{{ isInjective ? 'YES' : 'NO' }}</span></div>
           <div>Surjective (Onto): <span :class="{ pass: isSurjective }">{{ isSurjective ? 'YES' : 'NO' }}</span></div>
           <div class="bijective" v-if="isInjective && isSurjective">✨ BIJECTIVE ✨</div>
       </div>
       <button class="btn" @click="reset">Reset</button>
    </div>

    <div class="sets-container">
        <!-- Domain X -->
        <div class="set domain">
            <div class="set-title">Domain X</div>
            <div 
                v-for="x in domain" :key="x"
                class="element"
                :class="{ selected: selectedX === x }"
                @click="selectedX = x"
            >
                {{ x }}
                <div class="arrow-start" v-if="mapping[x]">→ {{ mapping[x] }}</div>
            </div>
        </div>

        <div class="arrow-zone">
            <span>Map x to y</span>
            <span v-if="selectedX" class="hint">Select Y for X={{selectedX}}</span>
            <span v-else class="hint">Click an X element first</span>
        </div>

        <!-- Codomain Y -->
        <div class="set codomain">
            <div class="set-title">Codomain Y</div>
            <div 
                v-for="y in codomain" :key="y"
                class="element"
                @click="mapTo(y)"
            >
                {{ y }}
                <div class="incoming-count" v-if="getIncoming(y) > 0">
                    {{ getIncoming(y) }} incoming
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const domain = ['x1', 'x2', 'x3'];
const codomain = ['y1', 'y2', 'y3', 'y4'];

// Mapping state: { x1: 'y1', ... }
const mapping = ref<Record<string, string>>({
    'x1': 'y1',
    'x2': 'y2'
});

const selectedX = ref<string | null>(null);

const mapTo = (y: string) => {
    if (selectedX.value) {
        mapping.value[selectedX.value] = y;
        selectedX.value = null;
    }
};

const reset = () => {
    mapping.value = {};
    selectedX.value = null;
};

const getIncoming = (y: string) => {
    return Object.values(mapping.value).filter(val => val === y).length;
};

// Injective: No y has > 1 incoming arrow
// Also all x must be mapped (technically for it to be a function on domain)
const isInjective = computed(() => {
    const values = Object.values(mapping.value);
    // Check if every x is mapped
    if (values.length < domain.length) return false;
    
    // Check uniqueness
    const unique = new Set(values);
    return unique.size === values.length;
});

// Surjective: Every y has >= 1 incoming arrow
const isSurjective = computed(() => {
    const values = new Set(Object.values(mapping.value));
    // Check if all y are covered
    return codomain.every(y => values.has(y));
});
</script>

<style scoped>
.mapping-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    padding: 0.5rem;
    border-radius: 8px;
}
.status {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.pass { color: #15803d; font-weight: bold; }
.bijective { color: #8b5cf6; font-weight: bold; font-size: 0.8rem; margin-top: 0.2rem; }

.sets-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}
.set {
    background: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.5rem;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.set-title {
    text-align: center;
    font-weight: bold;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.25rem;
}
.element {
    background: #f1f5f9;
    padding: 0.5rem;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
}
.element:hover { background: #e2e8f0; }

.domain .element.selected {
    background: #bfdbfe;
    border: 2px solid #3b82f6;
}

.arrow-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #94a3b8;
    font-size: 0.8rem;
}
.hint { font-size: 0.7rem; color: #3b82f6; }

.arrow-start {
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    color: #475569;
    width: 40px;
    text-align: left;
}
.incoming-count {
    position: absolute;
    right: -10px;
    top: -5px;
    background: #64748b;
    color: white;
    font-size: 0.6rem;
    padding: 2px 4px;
    border-radius: 4px;
}
</style>
