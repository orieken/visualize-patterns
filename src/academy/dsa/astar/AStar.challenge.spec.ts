import { describe, it, expect } from 'vitest';
import { aStarChallenge } from './AStarChallenge';
import { Graph } from './AStar';

describe('A* Challenge', () => {
  it('should find optimal path', () => {
    const graph: Graph = {
      nodes: {
        Start: { id: 'Start', x: 0, y: 0 },
        Mid:   { id: 'Mid', x: 5, y: 0 },
        End:   { id: 'End', x: 10, y: 0 }
      },
      edges: {
        Start: { Mid: 5 },
        Mid: { End: 5 }
      }
    };
    
    expect(aStarChallenge(graph, 'Start', 'End')).toEqual(['Start', 'Mid', 'End']);
  });
});
