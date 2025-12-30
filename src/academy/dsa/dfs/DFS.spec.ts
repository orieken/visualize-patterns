import { describe, it, expect } from 'vitest';
import { dfs } from './DFS';

describe('Depth-First Search (Reference)', () => {
  it('should traverse the graph in depth-first order', () => {
    const graph = {
      A: ['B', 'C'],
      B: ['D', 'E'],
      C: ['F'],
      D: [], E: [], F: []
    };
    // Possible DFS order depends on neighbor order. 
    // Assuming keys are iterated in insertion order for arrays:
    // A -> B -> D (back) -> E (back) -> C -> F
    expect(dfs(graph, 'A')).toEqual(['A', 'B', 'D', 'E', 'C', 'F']);
  });
});
