<template>
  <div class="circuit-viz">
    <div class="switches">
       <button class="switch" :class="{ on: inputA }" @click="inputA = !inputA">
         Input A ({{ inputA ? '1' : '0' }})
       </button>
       <button class="switch" :class="{ on: inputB }" @click="inputB = !inputB">
         Input B ({{ inputB ? '1' : '0' }})
       </button>
    </div>

    <svg class="circuit-board" viewBox="0 0 400 200">
       <!-- Wires A -->
       <path :d="`M 50 50 L 100 50 L 100 65`" :stroke="inputA ? '#ef4444' : '#334155'" stroke-width="3" fill="none" />
       <path :d="`M 50 50 L 80 50 L 80 135 L 100 135`" :stroke="inputA ? '#ef4444' : '#334155'" stroke-width="3" fill="none" />
       
       <!-- Wires B -->
       <path :d="`M 50 150 L 70 150 L 70 85 L 100 85`" :stroke="inputB ? '#ef4444' : '#334155'" stroke-width="3" fill="none" />
       <path :d="`M 50 150 L 100 150 L 100 165`" :stroke="inputB ? '#ef4444' : '#334155'" stroke-width="3" fill="none" />

       <!-- XOR Gate (Sum) -->
       <g transform="translate(100, 40)">
           <path d="M 0 0 Q 15 35 0 70 L 10 70 Q 40 35 10 0 Z" fill="#fff" stroke="#000" stroke-width="2"/>
           <path d="M -5 0 Q 10 35 -5 70" fill="none" stroke="#000" stroke-width="2"/>
           <text x="5" y="40" font-size="10">XOR</text>
           <line x1="30" y1="35" x2="200" y2="35" :stroke="sum ? '#ef4444' : '#334155'" stroke-width="3" />
       </g>

       <!-- AND Gate (Carry) -->
       <g transform="translate(100, 120)">
           <path d="M 0 0 V 50 H 20 Q 40 25 20 0 H 0 Z" fill="#fff" stroke="#000" stroke-width="2"/>
           <text x="5" y="30" font-size="10">AND</text>
           <line x1="36" y1="25" x2="200" y2="25" :stroke="carry ? '#ef4444' : '#334155'" stroke-width="3" />
       </g>
       
       <!-- Bulb Sum -->
       <circle cx="220" cy="75" r="15" :fill="sum ? '#facc15' : '#475569'" stroke="#000" />
       <text x="245" y="80">Sum ({{ sum ? 1 : 0 }})</text>
       
       <!-- Bulb Carry -->
       <circle cx="220" cy="145" r="15" :fill="carry ? '#facc15' : '#475569'" stroke="#000" />
       <text x="245" y="150">Carry ({{ carry ? 1 : 0 }})</text>
    </svg>
    
    <div class="truth-row">
       {{ inputA ? 1 : 0 }} + {{ inputB ? 1 : 0 }} = {{ (inputA?1:0) + (inputB?1:0) }} (Binary {{ carry ? 1 : 0 }}{{ sum ? 1 : 0 }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const inputA = ref(false);
const inputB = ref(false);

const sum = computed(() => inputA.value !== inputB.value); // XOR
const carry = computed(() => inputA.value && inputB.value); // AND
</script>

<style scoped>
.circuit-viz {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: #1e293b;
    padding: 1rem;
    border-radius: 8px;
    color: #fff;
}
.switches {
    display: flex;
    gap: 1rem;
}
.switch {
    background: #334155;
    color: #94a3b8;
    border: 2px solid #475569;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
.switch.on {
    background: #ef4444; /* Power Red */
    color: #fff;
    border-color: #b91c1c;
    box-shadow: 0 0 10px #ef4444;
}
.circuit-board {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 4px;
    width: 400px;
    height: 200px;
}
.truth-row {
    font-family: monospace;
    font-size: 1.1rem;
    color: #cbd5e1;
}
</style>
