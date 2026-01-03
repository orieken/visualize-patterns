<template>
  <div class="syntax-viz">
    <div class="input-area">
        <input v-model="inputExpr" placeholder="(p AND (NOT q))" />
        <div class="hint">Supported: p..z, AND, OR, NOT, (, )</div>
    </div>
    
    <div class="canvas-container">
        <svg v-if="treeRoot" :viewBox="viewBox" class="tree-svg">
            <g v-for="link in layout.links" :key="link.id">
                <line 
                    :x1="link.x1" :y1="link.y1" 
                    :x2="link.x2" :y2="link.y2" 
                    stroke="#94a3b8" stroke-width="2" 
                />
            </g>
            <g v-for="node in layout.nodes" :key="node.id">
                <circle 
                    :cx="node.x" :cy="node.y" r="16" 
                    fill="#fff" stroke="#3b82f6" stroke-width="2" 
                />
                <text 
                    :x="node.x" :y="node.y" 
                    dy="5" text-anchor="middle" 
                    font-size="12" font-weight="bold" fill="#1e3a8a"
                >
                    {{ node.val }}
                </text>
            </g>
        </svg>
        <div v-else class="error">
            Invalid Syntax or Empty. Ensure proper parenthesis.
            <br>Example: (p AND q)
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const inputExpr = ref('(p AND (NOT q))');

// --- Parser ---
type TreeNode = {
    id: string;
    val: string;
    left?: TreeNode;
    right?: TreeNode;
};

let nodeId = 0;
const parse = (expr: string): TreeNode | null => {
    expr = expr.trim();
    // 1. Remove outer parens if they enclose the whole expression
    // Valid check: (A) AND (B) shouldn't become A) AND (B
    while(expr.startsWith('(') && expr.endsWith(')') && checkBalanced(expr.slice(1, -1))) {
        expr = expr.slice(1, -1).trim();
    }
    
    // Base Case: Atom (single letter)
    if (/^[a-z]$/i.test(expr)) {
        return { id: `n-${nodeId++}`, val: expr };
    }
    
    // Recursive Step: Find splitting operator
    // Priority: implies > or > and > not (lowest binding power means main split)
    // But since we enforce parenthesis, we just look for the top-level op
    let depth = 0;
    let splitIdx = -1;
    let opLen = 0;
    
    // Scan to find *top level* operator. 
    // Simplified Logic: Scan for AND/OR/NOT outside strict valid parens
    // Actually, simple recursive descent is better but regex splitting is hard.
    // Let's assume Fully Parenthesized for simplicity in this demo.
    
    // Check NOT
    if (expr.startsWith('NOT ')) {
        const inner = parse(expr.slice(4));
        if (inner) {
            return { id: `n-${nodeId++}`, val: '¬', left: inner }; 
        }
    }
    
    // Check Binary Ops. We need to find the split point where depth is 0
    for(let i=0; i<expr.length; i++) {
        if(expr[i] === '(') depth++;
        else if(expr[i] === ')') depth--;
        else if (depth === 0) {
            // Check operators at this level
            const sub = expr.slice(i);
            if (sub.startsWith(' AND ')) { splitIdx = i; opLen = 5; break; }
            if (sub.startsWith(' OR ')) { splitIdx = i; opLen = 4; break; }
        }
    }
    
    if (splitIdx !== -1) {
        const leftExpr = expr.slice(0, splitIdx);
        const rightExpr = expr.slice(splitIdx + opLen);
        const op = expr.slice(splitIdx, splitIdx + opLen).trim();
        
        const lNode = parse(leftExpr);
        const rNode = parse(rightExpr);
        
        if(lNode && rNode) {
            return { 
                id: `n-${nodeId++}`, 
                val: op === 'AND' ? '∧' : '∨',
                left: lNode,
                right: rNode
            };
        }
    }

    return null;
};

const checkBalanced = (s: string) => {
    let d = 0;
    for(const c of s) {
        if(c==='(') d++;
        if(c===')') d--;
        if(d < 0) return false;
    }
    return d === 0;
};

// --- Layout ---
// Simple Reingold-Tilford inspired recursive layout
type LayoutNode = { id: string, x: number, y: number, val: string };
type LayoutLink = { id: string, x1: number, y1: number, x2: number, y2: number };

const treeRoot = computed(() => {
    nodeId = 0;
    // Pre-processing to standardize input
    // User might type '!' instead of NOT
    const norm = inputExpr.value
        .replace(/!/g, 'NOT ')
        .replace(/&&/g, ' AND ')
        .replace(/\|\|/g, ' OR ');
    return parse(norm);
});

const layout = computed(() => {
    const nodes: LayoutNode[] = [];
    const links: LayoutLink[] = [];
    if (!treeRoot.value) return { nodes, links };
    
    const traverse = (node: TreeNode, x: number, y: number, spread: number) => {
        nodes.push({ id: node.id, x, y, val: node.val });
        
        if (node.left) {
            // If unary NOT, place directly below
            if (!node.right) {
                 traverse(node.left, x, y + 60, spread);
                 links.push({ id: `${node.id}-${node.left.id}`, x1: x, y1: y+16, x2: x, y2: y+60-16 });
            } else {
                // Binary
                traverse(node.left, x - spread, y + 60, spread / 2);
                links.push({ id: `${node.id}-${node.left.id}`, x1: x, y1: y+16, x2: x-spread, y2: y+60-16 });
            }
        }
        
        if (node.right) {
            traverse(node.right, x + spread, y + 60, spread / 2);
            links.push({ id: `${node.id}-${node.right.id}`, x1: x, y1: y+16, x2: x+spread, y2: y+60-16 });
        }
    };
    
    traverse(treeRoot.value, 150, 30, 70);
    return { nodes, links };
});

const viewBox = computed(() => "0 0 300 250");
</script>

<style scoped>
.syntax-viz {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.input-area {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.input-area input {
    padding: 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-family: monospace;
}
.hint {
    font-size: 0.75rem;
    color: #64748b;
}
.canvas-container {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.tree-svg {
    width: 100%;
    height: 100%;
}
.error {
    color: #ef4444;
    text-align: center;
    font-size: 0.9rem;
}
</style>
