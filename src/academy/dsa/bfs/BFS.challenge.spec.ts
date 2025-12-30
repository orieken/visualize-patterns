import { describe, it, expect } from 'vitest';
import { bfsChallenge } from './BFSChallenge';

describe('BFS Challenge', () => {
  it('should traverse level by level', () => {
    const graph = {
      A: ['B', 'C'],
      B: ['D'],
      C: ['E'],
      D: [], E: []
    };
    // Expected: A -> B,C -> D,E
    expect(bfsChallenge(graph, 'A')).toEqual(['A', 'B', 'C', 'D', 'E']);
  });
});
