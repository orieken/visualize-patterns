<template>
  <div class="matrix-viz">
    <div class="matrix-container">
        <!-- Matrix A -->
        <div class="matrix-wrapper">
            <span class="matrix-label">A (2x2)</span>
            <div class="matrix a">
                <div 
                    v-for="(row, r) in A" :key="`a-${r}`" 
                    class="row-group"
                >
                    <div 
                        v-for="(val, c) in row" :key="`a-${r}-${c}`"
                        class="cell"
                        :class="{ active: activeRow === r }"
                    >
                        {{ val }}
                    </div>
                </div>
            </div>
        </div>

        <div class="op">×</div>

        <!-- Matrix B -->
        <div class="matrix-wrapper">
            <span class="matrix-label">B (2x2)</span>
            <div class="matrix b">
                <div v-for="(row, r) in B" :key="`b-${r}`" class="row-group">
                    <div 
                         v-for="(val, c) in row" :key="`b-${r}-${c}`"
                         class="cell"
                         :class="{ active: activeCol === c }"
                    >
                        {{ val }}
                    </div>
                </div>
            </div>
        </div>

        <div class="op">=</div>

        <!-- Result C -->
        <div class="matrix-wrapper">
            <span class="matrix-label">C (Result)</span>
            <div class="matrix c">
                <div v-for="(row, r) in C" :key="`c-${r}`" class="row-group">
                    <div 
                        v-for="(val, c) in row" :key="`c-${r}-${c}`"
                        class="cell result"
                        :class="{ active: activeRow === r && activeCol === c }"
                        @mouseenter="highlight(r, c)"
                    >
                        {{ val }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="explanation">
        <p v-if="activeRow !== null && activeCol !== null">
            Calculating C[{{activeRow}}][{{activeCol}}]: 
            <span class="calc">
                Row {{activeRow}} (A) • Col {{activeCol}} (B) = 
                ({{A[activeRow][0]}} × {{B[0][activeCol]}}) + ({{A[activeRow][1]}} × {{B[1][activeCol]}})
                = {{ C[activeRow][activeCol] }}
            </span>
        </p>
        <p v-else>Hover over the result matrix (C) to see the dot product calculation.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const A = [
    [1, 2],
    [3, 4]
];

const B = [
    [2, 0],
    [1, 2]
];

// Computed manually for demo
const C = [
    [4, 4],   // 1*2+2*1=4, 1*0+2*2=4
    [10, 8]   // 3*2+4*1=10, 3*0+4*2=8
];

const activeRow = ref<number | null>(null);
const activeCol = ref<number | null>(null);

const highlight = (r: number, c: number) => {
    activeRow.value = r;
    activeCol.value = c;
};
</script>

<style scoped>
.matrix-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}
.matrix-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.matrix-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}
.matrix-label {
    font-size: 0.8rem;
    font-weight: bold;
    color: #64748b;
}
.matrix {
    display: grid;
    gap: 2px;
    background: #0f172a;
    padding: 4px;
    border-radius: 4px;
}
.row-group {
    display: flex;
    gap: 2px;
}
.cell {
    width: 40px;
    height: 40px;
    background: #fff;
    display: grid;
    place-items: center;
    font-weight: bold;
    font-family: monospace;
    transition: background 0.2s;
}
.op {
    font-size: 1.5rem;
    color: #64748b;
}

/* Highlighting */
.matrix.a .cell.active {
    background: #bae6fd; /* Light Blue */
}
.matrix.b .cell.active {
    background: #fed7aa; /* Light Orange */
}
.matrix.c .cell.result {
    cursor: pointer;
}
.matrix.c .cell.active {
    background: #bbf7d0; /* Green */
    border: 2px solid #16a34a;
}
.explanation {
    height: 3rem;
    text-align: center;
    font-size: 0.9rem;
    color: #334155;
}
.calc {
    font-family: monospace;
    background: #f1f5f9;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
}
</style>
