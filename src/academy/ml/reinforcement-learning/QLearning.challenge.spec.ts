import { describe, it, expect } from 'vitest';
import { QLearningChallenge } from './QLearningChallenge';

describe('Q-Learning Challenge', () => {
  it('should update Q-values', () => {
    const ql = new QLearningChallenge(2, 2);
    
    // Initial: 0
    expect(ql.getQ(0, 0)).toBe(0);
    
    // Learn: State 0, Action 0, Reward 10, Next State 1
    ql.learn(0, 0, 10, 1);
    
    // Should be non-zero if implemented
    expect(ql.getQ(0, 0)).not.toBe(0);
  });
});
