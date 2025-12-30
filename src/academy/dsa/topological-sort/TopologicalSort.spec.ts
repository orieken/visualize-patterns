import { describe, it, expect } from 'vitest';
import { topologicalSort } from './TopologicalSort';

describe('Topological Sort (Reference)', () => {
  it('should order dependencies correctly', () => {
    const graph = {
      A: ['B', 'C'],
      B: ['D'],
      C: ['D'],
      D: []
    };
    // A must be before B and C.
    // B and C must be before D.
    // A -> B -> C -> D  OR  A -> C -> B -> D
    const result = topologicalSort(graph);
    
    expect(result.indexOf('A')).toBeLessThan(result.indexOf('B'));
    expect(result.indexOf('A')).toBeLessThan(result.indexOf('C'));
    expect(result.indexOf('B')).toBeLessThan(result.indexOf('D'));
    expect(result.indexOf('C')).toBeLessThan(result.indexOf('D'));
  });
});
