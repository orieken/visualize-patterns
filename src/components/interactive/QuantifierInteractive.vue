<template>
  <div class="quantifier-viz">
    <div class="controls">
       <button @click="randomize" class="btn">New World</button>
       <div class="check-group">
           <div class="check" :class="{ pass: checkForAllRedSquare }">
               <span class="symbol">∀x (Red(x) → Square(x))</span>
               <span>{{ checkForAllRedSquare ? 'TRUE' : 'FALSE' }}</span>
           </div>
           <div class="check" :class="{ pass: checkExistsBlueCircle }">
               <span class="symbol">∃x (Blue(x) ∧ Circle(x))</span>
               <span>{{ checkExistsBlueCircle ? 'TRUE' : 'FALSE' }}</span>
           </div>
       </div>
    </div>

    <div class="world">
       <div 
         v-for="obj in objects" 
         :key="obj.id" 
         class="obj"
         :class="[obj.color, obj.shape]"
         :style="{ left: obj.x + '%', top: obj.y + '%' }"
       >
         <span class="label">{{ obj.id }}</span>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type Shape = 'square' | 'circle';
type Color = 'red' | 'blue' | 'green';
type WorldObject = { id: number, shape: Shape, color: Color, x: number, y: number };

const objects = ref<WorldObject[]>([]);

const randomize = () => {
    const shapes: Shape[] = ['square', 'circle'];
    const colors: Color[] = ['red', 'blue', 'green'];
    
    const newObjs: WorldObject[] = [];
    for(let i=0; i<8; i++) {
        newObjs.push({
            id: i,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
        });
    }
    objects.value = newObjs;
};

// ∀x (Red(x) → Square(x))
// Equivalent: NOT (∃x (Red(x) AND NOT Square(x)))
const checkForAllRedSquare = computed(() => {
    if (objects.value.length === 0) return true; // Vacuously true
    return objects.value.every(o => {
        if (o.color === 'red') return o.shape === 'square';
        return true; 
    });
});

// ∃x (Blue(x) ∧ Circle(x))
const checkExistsBlueCircle = computed(() => {
    return objects.value.some(o => o.color === 'blue' && o.shape === 'circle');
});

randomize();
</script>

<style scoped>
.quantifier-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn {
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
}
.check-group {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
}
.check {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 4px;
    min-width: 140px;
}
.check.pass {
    background: #dcfce7;
    color: #15803d;
}
.symbol {
    font-weight: bold;
    font-family: monospace;
    margin-bottom: 0.25rem;
}
.world {
    position: relative;
    height: 200px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}
.obj {
    position: absolute;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    color: white;
    font-weight: bold;
    transition: all 0.5s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.obj.circle { border-radius: 50%; }
.obj.square { border-radius: 4px; }

.obj.red { background: #ef4444; }
.obj.blue { background: #3b82f6; }
.obj.green { background: #10b981; }
</style>
