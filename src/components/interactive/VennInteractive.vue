<template>
  <div class="venn-viz">
    <div class="controls">
        <label><input type="checkbox" :checked="setA.has(1)" @change="toggle(setA, 1)" /> 1</label>
        <label><input type="checkbox" :checked="setA.has(2)" @change="toggle(setA, 2)" /> 2</label>
        <label><input type="checkbox" :checked="setA.has(3)" @change="toggle(setA, 3)" /> 3</label>
        <div class="sep"></div>
        <button 
           v-for="op in ['UNION', 'INTERSECT', 'DIFF']" 
           :key="op"
           class="op-btn"
           :class="{ active: operation === op }"
           @click="operation = op"
        >{{ op }}</button>
        <div class="sep"></div>
        <label><input type="checkbox" :checked="setB.has(2)" @change="toggle(setB, 2)" /> 2</label>
        <label><input type="checkbox" :checked="setB.has(3)" @change="toggle(setB, 3)" /> 3</label>
        <label><input type="checkbox" :checked="setB.has(4)" @change="toggle(setB, 4)" /> 4</label>
    </div>

    <div class="diagram">
        <!-- Circles CSS -->
        <div class="circle c-a">
            <span class="set-label">A</span>
        </div>
        <div class="circle c-b">
            <span class="set-label">B</span>
        </div>
        
        <!-- Elements -->
        <div class="elements">
            <div 
                v-for="el in allElements" 
                :key="el"
                class="el" 
                :class="{ 
                    'in-a': setA.has(el), 
                    'in-b': setB.has(el),
                    'result': isInResult(el)
                }"
            >{{ el }}</div>
        </div>
    </div>
    
    <div class="res-text">
        Result Set: { {{ Array.from(resultSet).sort().join(', ') }} }
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const allElements = [1, 2, 3, 4];
// Use logic: 1 is usually only A, 2,3 overlap, 4 only B
const setA = reactive(new Set([1, 2]));
const setB = reactive(new Set([2, 3, 4]));
const operation = ref('UNION');

const toggle = (set: Set<number>, val: number) => {
    if (set.has(val)) set.delete(val);
    else set.add(val);
};

const resultSet = computed(() => {
    const res = new Set<number>();
    
    if (operation.value === 'UNION') {
        allElements.forEach(e => { if (setA.has(e) || setB.has(e)) res.add(e); });
    } else if (operation.value === 'INTERSECT') {
        allElements.forEach(e => { if (setA.has(e) && setB.has(e)) res.add(e); });
    } else if (operation.value === 'DIFF') {
        allElements.forEach(e => { if (setA.has(e) && !setB.has(e)) res.add(e); });
    }
    return res;
});

const isInResult = (el: number) => resultSet.value.has(el);
</script>

<style scoped>
.venn-viz {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
.controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background: #f1f5f9;
    padding: 0.5rem;
    border-radius: 8px;
}
.sep { width: 1px; height: 20px; background: #cbd5e1; margin: 0 0.5rem; }

.op-btn {
    padding: 0.25rem 0.5rem;
    border: 1px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    font-size: 0.8rem;
    border-radius: 4px;
}
.op-btn.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
}

.diagram {
    position: relative;
    width: 300px;
    height: 200px;
    display: grid;
    place-items: center;
}
.circle {
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    opacity: 0.3;
    mix-blend-mode: multiply;
}
.c-a { background: #fca5a5; left: 20px; } /* Red-ish */
.c-b { background: #93c5fd; right: 20px; } /* Blue-ish */

.set-label {
    position: absolute;
    top: 10px;
    font-weight: bold;
    font-size: 1.2rem;
    color: #475569;
}
.c-a .set-label { left: 20px; }
.c-b .set-label { right: 20px; }

.elements {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 100%;
    z-index: 10;
}
.el {
    position: absolute;
    background: #fff;
    border: 1px solid #94a3b8;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: bold;
    transition: all 0.3s;
    font-size: 0.8rem;
}
/* Positioning Strategy */
.el:nth-child(1) { left: 50px; top: 100px; } /* Usually A only */
.el:nth-child(2) { left: 130px; top: 80px; } /* Overlap */
.el:nth-child(3) { left: 130px; top: 120px; } /* Overlap */
.el:nth-child(4) { left: 220px; top: 100px; } /* Usually B only */

.el.in-a { border-color: #ef4444; }
.el.in-b { border-color: #3b82f6; }
.el.in-a.in-b { border-color: #8b5cf6; }

.el.result {
    background: #10b981;
    color: white;
    border-color: #059669;
    transform: scale(1.2);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.res-text {
    font-weight: bold;
    color: #10b981;
}
</style>
