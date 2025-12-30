import { describe, it, expect } from 'vitest';
import { GradientBoosting } from './GradientBoosting';

describe('Gradient Boosting (Reference)', () => {
  it('should reduce error over iterations', () => {
    // Target is constant 10
    const X = [1, 2, 3];
    const y = [10, 10, 10];
    
    const gb = new GradientBoosting();
    gb.fit(X, y, 10);
    
    // With sums of small steps, we should approach 10
    // Each step learns mean of residuals.
    // Iter 1: mean 10. Learn 10. Pred += 0.1*10 = 1. Resid = 9.
    // Iter 2: mean 9. Learn 9. Pred += 0.1*9 = 0.9. Total = 1.9. Resid=8.1.
    // Slowly converges.
    expect(gb.predict(1)).toBeGreaterThan(5); 
  });
});
