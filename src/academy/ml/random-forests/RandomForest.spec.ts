import { describe, it, expect } from 'vitest';
import { RandomForest } from './RandomForest';

describe('Random Forest (Reference)', () => {
  it('should aggregate votes', () => {
    const rf = new RandomForest(3);
    rf.fit([], []);
    
    // DT reference hardcode: < 5 is 0, else 1
    expect(rf.predict([2])).toBe(0);
    expect(rf.predict([8])).toBe(1);
  });
});
