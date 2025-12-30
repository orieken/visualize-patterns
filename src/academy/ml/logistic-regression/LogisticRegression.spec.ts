import { describe, it, expect } from 'vitest';
import { LogisticRegression } from './LogisticRegression';

describe('Logistic Regression (Reference)', () => {
  it('should classify simple 1D data', () => {
    // 0s are small numbers, 1s are large numbers
    const x = [1, 2, 8, 9];
    const y = [0, 0, 1, 1];
    
    const lr = new LogisticRegression();
    lr.fit(x, y);
    
    expect(lr.predict(1.5)).toBe(0);
    expect(lr.predict(8.5)).toBe(1);
  });
});
