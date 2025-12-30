import { describe, it, expect } from 'vitest';
import { GradientBoostingChallenge } from './GradientBoostingChallenge';

describe('Gradient Boosting Challenge', () => {
  it('should sum up learners', () => {
    const gb = new GradientBoostingChallenge();
    // Assuming fit works or we manually add learners
    gb.learners.push({ predict: () => 10, fit: () => {}, value: 10 });
    gb.learners.push({ predict: () => 10, fit: () => {}, value: 10 });
    
    // 0.1 * 10 + 0.1 * 10 = 2
    expect(gb.predict(1)).toBe(2);
  });
});
