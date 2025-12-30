import { describe, it, expect } from 'vitest';
import { PCAChallenge } from './PCAChallenge';

describe('PCA Challenge', () => {
  it('should return projected data', () => {
    const data = [[1, 1], [2, 2]];
    const pca = new PCAChallenge(1);
    const res = pca.fitTransform(data);
    
    expect(res).toBeDefined();
    // Expect non-empty 1D
    expect(res.length).toBe(2);
    expect(res[0].length).toBe(1);
  });
});
