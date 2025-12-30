import { describe, it, expect } from 'vitest';
import { topologicalSortChallenge } from './TopologicalSortChallenge';

describe('Topological Sort Challenge', () => {
  it('should sort DAG', () => {
    const graph = {
      1: ['2'],
      2: ['3'],
      3: []
    };
    expect(topologicalSortChallenge(graph)).toEqual(['1', '2', '3']);
  });
});
