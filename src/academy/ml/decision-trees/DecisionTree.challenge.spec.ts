import { describe, it, expect } from 'vitest';
import { DecisionTreeChallenge } from './DecisionTreeChallenge';

describe('Decision Tree Challenge', () => {
  it('should traverse the tree', () => {
    const dt = new DecisionTreeChallenge();
    dt.fit([], []); // Should build tree: x < 10 -> 0, else 1
    
    expect(dt.predict([5])).toBe(0);
    expect(dt.predict([15])).toBe(1);
  });
});
