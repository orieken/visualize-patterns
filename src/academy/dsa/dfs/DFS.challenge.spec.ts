import { describe, it, expect } from 'vitest';
import { dfsChallenge } from './DFSChallenge';

describe('DFS Challenge', () => {
  it('should traverse depth first', () => {
    const graph = {
      1: ['2', '5'],
      2: ['3', '4'],
      3: [], 4: [], 5: []
    };
    // 1 -> 2 -> 3 -> 4 -> 5
    expect(dfsChallenge(graph, '1')).toEqual(['1', '2', '3', '4', '5']);
  });
});
