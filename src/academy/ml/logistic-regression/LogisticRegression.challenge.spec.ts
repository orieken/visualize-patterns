import { describe, it, expect } from 'vitest';
import { LogisticRegressionChallenge } from './LogisticRegressionChallenge';

describe('Logistic Regression Challenge', () => {
  it('should correctly predict classes using sigmoid', () => {
    const lr = new LogisticRegressionChallenge();
    lr.fit([], []); // We use pre-set params in challenge for simplicity
    
    // With m=1.5, b=-7, boundary is ~4.6
    expect(lr.predict(2)).toBe(0);
    expect(lr.predict(6)).toBe(1);
    
    // Check sigmoid directly if public? No, strictly black box test
  });
});
