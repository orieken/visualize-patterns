import { describe, it, expect } from 'vitest';
import { dijkstra } from './Dijkstra';

describe('Dijkstra (Reference)', () => {
  it('should find shortest paths in a weighted graph', () => {
    const graph = {
      A: { B: 1, C: 4 },
      B: { C: 2, D: 5 },
      C: { D: 1 },
      D: {}
    };
    // A -> B = 1
    // A -> B -> C = 3 (Better than A->C direct which is 4)
    // A -> B -> C -> D = 4 (Better than A->B->D which is 6)
    
    const dists = dijkstra(graph, 'A');
    expect(dists['A']).toBe(0);
    expect(dists['B']).toBe(1);
    expect(dists['C']).toBe(3);
    expect(dists['D']).toBe(4);
  });
});
