import { describe, it, expect } from 'vitest';
import { KNN } from './KNN';

describe('KNN (Reference)', () => {
  it('should classify based on neighbors', () => {
    const knn = new KNN(3);
    // Groups: 1,2 (class 0) ... 10,11 (class 1)
    knn.fit([1, 2, 10, 11, 12], [0, 0, 1, 1, 1]);
    
    expect(knn.predict(3)).toBe(0); // Closer to 1,2
    expect(knn.predict(9)).toBe(1); // Closer to 10,11
  });
});
