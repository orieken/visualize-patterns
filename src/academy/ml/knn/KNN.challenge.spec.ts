import { describe, it, expect } from 'vitest';
import { KNNChallenge } from './KNNChallenge';

describe('KNN Challenge', () => {
  it('should find nearest class', () => {
    const knn = new KNNChallenge(1);
    knn.fit([1, 10], [0, 1]);
    
    expect(knn.predict(2)).toBe(0);
    expect(knn.predict(9)).toBe(1);
  });
});
