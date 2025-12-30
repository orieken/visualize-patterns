import { describe, it, expect } from 'vitest';
import { LinearRegressionChallenge } from './LinearRegressionChallenge';

describe('Linear Regression Challenge', () => {
  it('should learn y = x', () => {
    const x = [1, 2, 3];
    const y = [1, 2, 3];
    
    const lr = new LinearRegressionChallenge();
    lr.fit(x, y);
    
    expect(lr.predict(4)).toBeCloseTo(4);
  });
});
