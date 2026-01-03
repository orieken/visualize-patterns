<template>
  <div class="graph-matrix-viz">
    <div class="viz-row">
        <!-- SVG Graph -->
        <div class="graph-panel">
            <h4>Graph G</h4>
            <svg viewBox="0 0 200 200" class="graph-svg">
                <!-- Edges -->
                <line x1="100" y1="30" x2="30" y2="170" stroke="#94a3b8" marker-end="url(#arrow)" />
                <line x1="30" y1="170" x2="170" y2="170" stroke="#94a3b8" marker-end="url(#arrow)" />
                <line x1="170" y1="170" x2="100" y2="30" stroke="#94a3b8" marker-end="url(#arrow)" />
                
                <!-- Defs -->
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
                    </marker>
                </defs>

                <!-- Nodes -->
                <g>
                    <circle cx="100" cy="30" r="15" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
                    <text x="100" y="35" text-anchor="middle" font-size="12">0</text>
                </g>
                <g>
                    <circle cx="30" cy="170" r="15" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
                    <text x="30" y="175" text-anchor="middle" font-size="12">1</text>
                </g>
                <g>
                    <circle cx="170" cy="170" r="15" fill="#fff" stroke="#3b82f6" stroke-width="2"/>
                    <text x="170" y="175" text-anchor="middle" font-size="12">2</text>
                </g>
            </svg>
            <div class="caption">Cycle: 0→1→2→0</div>
        </div>
        
        <!-- Matrix M -->
        <div class="matrix-panel">
            <h4>Adj Matrix M</h4>
            <div class="matrix">
                <div class="row" v-for="(row, i) in M" :key="i">
                    <!-- Manual grid for G -->
                    <span v-for="(val, j) in row" :key="j" class="cell">{{ val }}</span>
                </div>
            </div>
        </div>

        <!-- Matrix M^2 -->
        <div class="matrix-panel">
            <h4>M<sup>2</sup> (Paths len 2)</h4>
            <div class="matrix result">
                <div class="row" v-for="(row, i) in M2" :key="i">
                     <span 
                       v-for="(val, j) in row" 
                       :key="j" 
                       class="cell"
                       :class="{ highlight: val > 0 }"
                       @mouseenter="hoverPath(i, j)"
                     >{{ val }}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="path-info" v-if="hoveredInfo">
        {{ hoveredInfo }}
    </div>
    <div class="path-info" v-else>Hover over M<sup>2</sup> cells to explain.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Cycle Graph: 0->1, 1->2, 2->0
const M = [
    [0, 1, 0], // Node 0 -> 1
    [0, 0, 1], // Node 1 -> 2
    [1, 0, 0]  // Node 2 -> 0
];

// M^2 Calculation
const M2 = computed(() => {
    const size = 3;
    const res = [
        [0,0,0], 
        [0,0,0], 
        [0,0,0]
    ];
    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            for(let k=0; k<size; k++) {
                res[i][j] += M[i][k] * M[k][j];
            }
        }
    }
    return res;
});

const hoveredInfo = ref('');

const hoverPath = (i: number, j: number) => {
    const count = M2.value[i][j];
    if (count === 0) {
        hoveredInfo.value = `No 2-step paths from ${i} to ${j}`;
    } else {
        // Find intermediate node
        let mid = -1;
        for(let k=0; k<3; k++) if(M[i][k] && M[k][j]) mid = k;
        hoveredInfo.value = `${count} path(s): ${i} → ${mid} → ${j}`;
    }
};
</script>

<style scoped>
.graph-matrix-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.viz-row {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
}
h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; text-align: center; }
.graph-panel { width: 120px; text-align: center; }
.graph-svg { width: 120px; height: 120px; }
.caption { font-size: 0.7rem; color: #64748b; }

.matrix-panel { display: flex; flex-direction: column; align-items: center; }
.matrix {
    display: grid;
    gap: 2px;
    background: #0f172a;
    padding: 3px;
    border-radius: 4px;
}
.row { display: flex; gap: 2px; }
.cell {
    width: 30px;
    height: 30px;
    background: #fff;
    display: grid;
    place-items: center;
    font-weight: bold;
    font-size: 0.9rem;
}
.result .cell { cursor: help; }
.result .cell.highlight { background: #dcfce7; color: #166534; }

.path-info {
    text-align: center;
    background: #f1f5f9;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: bold;
    color: #334155;
    min-height: 2rem;
}
</style>
