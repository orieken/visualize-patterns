import { describe, it, expect } from 'vitest';
import { aStar, Graph } from './AStar';

describe('A* Search (Reference)', () => {
  it('should find the shortest path using heuristic', () => {
    // Simple grid:
    // A(0,0) -1-> B(1,0) -1-> C(2,0)
    // |           |
    // 5           1
    // |           |
    // D(0,1) -5-> E(1,1)
    
    // A->B->E (Cost 2) is shorter than A->D->E (Cost 10)
    const graph: Graph = {
      nodes: {
        A: { id: 'A', x: 0, y: 0 },
        B: { id: 'B', x: 1, y: 0 },
        C: { id: 'C', x: 2, y: 0 },
        D: { id: 'D', x: 0, y: 1 },
        E: { id: 'E', x: 1, y: 1 }
      },
      edges: {
        A: { B: 1, D: 5 },
        B: { E: 1, C: 1 },
        C: {},
        D: { E: 5 },
        E: {}
      }
    };
    
    const path = aStar(graph, 'A', 'E');
    expect(path).toEqual(['A', 'B', 'E']);
  });
});
