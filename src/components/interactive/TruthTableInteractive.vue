<template>
  <div class="truth-table-viz">
    <div class="controls">
      <div class="expression-input">
        <label>Expression 1 (Left):</label>
        <div class="toggle-group">
           <button 
             v-for="op in ['A', 'B', 'AND', 'OR', 'NOT', '(', ')']" 
             :key="op"
             @click="addToExpr(1, op)"
           >{{ op }}</button>
           <button class="clear" @click="expr1 = ''">CLR</button>
        </div>
        <input v-model="expr1" placeholder="e.g. !(A && B)" />
      </div>

      <div class="expression-input">
        <label>Expression 2 (Right):</label>
        <div class="toggle-group">
           <button 
             v-for="op in ['A', 'B', 'AND', 'OR', 'NOT', '(', ')']" 
             :key="op"
             @click="addToExpr(2, op)"
           >{{ op }}</button>
           <button class="clear" @click="expr2 = ''">CLR</button>
        </div>
        <input v-model="expr2" placeholder="e.g. (!A) || (!B)" />
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>A</th>
            <th>B</th>
            <th class="result-col">Expr 1</th>
            <th class="result-col">Expr 2</th>
            <th>Match?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in tableData" :key="i">
            <td :class="{ true: row.A, false: !row.A }">{{ row.A ? 'T' : 'F' }}</td>
            <td :class="{ true: row.B, false: !row.B }">{{ row.B ? 'T' : 'F' }}</td>
            <td class="res">{{ row.res1 === null ? 'Err' : (row.res1 ? 'T' : 'F') }}</td>
            <td class="res">{{ row.res2 === null ? 'Err' : (row.res2 ? 'T' : 'F') }}</td>
            <td>
                <span v-if="row.res1 === row.res2 && row.res1 !== null">✅</span>
                <span v-else>❌</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="verdict" :class="{ valid: isEquivalent }">
      {{ isEquivalent ? 'LOGICALLY EQUIVALENT' : 'NOT EQUIVALENT' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const expr1 = ref('!(A && B)');
const expr2 = ref('(!A) || (!B)');

const evaluate = (expr: string, A: boolean, B: boolean): boolean | null => {
    try {
        // Safe evaluation by replacing operators with JS equivalents
        let jsExpr = expr
            .replace(/AND/g, '&&')
            .replace(/OR/g, '||')
            .replace(/NOT/g, '!')
            // Handle A and B replacement carefully to avoid replacing inside words if we had them
            .replace(/\bA\b/g, String(A))
            .replace(/\bB\b/g, String(B));
            
        // Very basic sanitization (only allow specific chars)
        if (!/^[truefalse\s&|!()]+$/.test(jsExpr)) return null;
        
        // eslint-disable-next-line no-new-func
        return new Function(`return ${jsExpr}`)();
    } catch {
        return null;
    }
};

const addToExpr = (target: number, char: string) => {
    if (target === 1) expr1.value += (char.length > 1 ? ` ${char} ` : char);
    else expr2.value += (char.length > 1 ? ` ${char} ` : char);
};

const tableData = computed(() => {
    const scenarios = [
        { A: true, B: true },
        { A: true, B: false },
        { A: false, B: true },
        { A: false, B: false }
    ];
    
    return scenarios.map(scen => ({
        A: scen.A,
        B: scen.B,
        res1: evaluate(expr1.value, scen.A, scen.B),
        res2: evaluate(expr2.value, scen.A, scen.B)
    }));
});

const isEquivalent = computed(() => {
    return tableData.value.every(row => row.res1 === row.res2 && row.res1 !== null);
});
</script>

<style scoped>
.truth-table-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255,255,255,0.5);
    padding: 0.75rem;
    border-radius: 8px;
}
.expression-input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.expression-input input {
    padding: 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-family: monospace;
}
.toggle-group {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}
.toggle-group button {
    padding: 0.2rem 0.5rem;
    border: 1px solid #94a3b8;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
}
.toggle-group button:hover {
    background: #f1f5f9;
}
.toggle-group button.clear {
    border-color: #ef4444;
    color: #ef4444;
}

.table-container {
    overflow-x: auto;
}
table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
th, td {
    padding: 0.5rem;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
}
th {
    background: #f8fafc;
    font-weight: 600;
    font-size: 0.85rem;
}
.result-col {
    background: #eff6ff;
}
td.true { color: #15803d; font-weight: bold; }
td.false { color: #ef4444; font-weight: bold; }
td.res { font-family: monospace; }

.verdict {
    text-align: center;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 4px;
    background: #fee2e2;
    color: #b91c1c;
}
.verdict.valid {
    background: #dcfce7;
    color: #15803d;
}
</style>
