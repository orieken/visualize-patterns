import { describe, it, expect } from 'vitest';
import { RandomForestChallenge } from './RandomForestChallenge';

describe('Random Forest Challenge', () => {
  it('should vote correctly', () => {
    const rf = new RandomForestChallenge(3);
    rf.fit([], []);
    
    expect(rf.predict([2])).toBe(0);
    expect(rf.predict([8])).toBe(1);
  });
});
