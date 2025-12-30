import { describe, it, expect } from 'vitest';
import { DecisionTree } from './DecisionTree';

describe('Decision Tree (Reference)', () => {
  it('should split data correctly', () => {
    const dt = new DecisionTree();
    dt.fit([], []); // Uses hardcoded rule: x < 5 is 0
    
    expect(dt.predict([2])).toBe(0);
    expect(dt.predict([8])).toBe(1);
  });
});
