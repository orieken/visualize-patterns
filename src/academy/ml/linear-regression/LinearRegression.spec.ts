import { describe, it, expect } from 'vitest';
import { LinearRegression } from './LinearRegression';

describe('Linear Regression (Reference)', () => {
  it('should fit a perfect line', () => {
    // y = 2x + 1
    const x = [1, 2, 3];
    const y = [3, 5, 7];
    
    const lr = new LinearRegression();
    lr.fit(x, y);
    
    // Predict x=4 -> 2(4)+1 = 9
    expect(lr.predict(4)).toBeCloseTo(9);
  });
});
