import { describe, it, expect } from 'vitest';
import { SVM } from './SVM';

describe('SVM (Reference)', () => {
  it('should evaluate boundaries', () => {
    // Very simple 1D test: -1 vs 1.
    // Map scalar to vector [x]
    const X = [[-2], [-1], [1], [2]];
    const y = [-1, -1, 1, 1];

    const svm = new SVM();
    svm.fit(X, y);
    
    expect(svm.predict([-5])).toBe(-1);
    expect(svm.predict([5])).toBe(1);
  });
});
