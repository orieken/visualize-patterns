import { describe, it, expect } from 'vitest';
import { SVMChallenge } from './SVMChallenge';

describe('SVM Challenge', () => {
  it('should use hyperplane for prediction', () => {
    const svm = new SVMChallenge();
    // Simulate a trained model: w=[1], b=0 -> predicts sign(x)
    svm.w = [1];
    svm.b = 0;
    
    expect(svm.predict([5])).toBe(1);
    expect(svm.predict([-5])).toBe(-1);
  });
});
