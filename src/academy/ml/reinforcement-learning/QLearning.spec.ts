import { describe, it, expect } from 'vitest';
import { QLearning } from './QLearning';

describe('Q-Learning (Reference)', () => {
  it('should learn to reach goal', () => {
    // 3 States: [0] -> [1] -> [2] (Goal)
    // Action 1 moves Right
    const ql = new QLearning(3, 2, 2);
    
    // Train
    // 1 -> 2
    for(let i=0; i<50; i++) {
        ql.learn(1, 1, 10, 2); // Transition 1->2 gets +10
        ql.learn(0, 1, -1, 1); // Transition 0->1 gets -1
    }
    
    // Q(1, Right) should be high
    expect(ql.getQ(1, 1)).toBeGreaterThan(5);
    // Q(0, Right) should be positive due to gamma propagation from 1
    // Q(0,1) ~ -1 + 0.9 * Q(1,1) ~ -1 + 0.9*10 ~ 8
    expect(ql.getQ(0, 1)).toBeGreaterThan(0);
  });
});
