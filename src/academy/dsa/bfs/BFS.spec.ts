import { describe, it, expect } from 'vitest';
import { bfs } from './BFS';

describe('Breadth-First Search (Reference)', () => {
  it('should traverse the graph in breadth-first order', () => {
    const graph = {
      A: ['B', 'C'],
      B: ['D', 'E'],
      C: ['F'],
      D: [], E: [], F: []
    };
    expect(bfs(graph, 'A')).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });
});
