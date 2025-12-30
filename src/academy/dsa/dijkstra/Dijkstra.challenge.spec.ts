import { describe, it, expect } from 'vitest';
import { dijkstraChallenge } from './DijkstraChallenge';

describe('Dijkstra Challenge', () => {
  it('should calculate shortest paths', () => {
    const graph = {
      S: { A: 4, B: 2 },
      A: { B: 5, D: 10 },
      B: { A: 1, D: 5 }, // B->A makes path S->B->A cost 3 (better than S->A cost 4)
      D: {}
    };
    
    const dists = dijkstraChallenge(graph, 'S');
    expect(dists['S']).toBe(0);
    expect(dists['B']).toBe(2);
    expect(dists['A']).toBe(3); // S->B->A
    expect(dists['D']).toBe(7); // S->B->D
  });
});
