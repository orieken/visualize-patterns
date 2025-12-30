import { describe, it, expect } from 'vitest';
import { PCA } from './PCA';

describe('PCA (Reference)', () => {
  it('should reduce dimensionality', () => {
    // Data perfectly correlated x=y
    const data = [[1, 1], [2, 2], [3, 3]];
    const pca = new PCA(1);
    const projected = pca.fitTransform(data);
    
    // Should capture variance: points should be distinct and ordered
    expect(projected[0][0]).toBeLessThan(projected[1][0]);
    expect(projected[1][0]).toBeLessThan(projected[2][0]);
    // OR reversed depending on eigenvector sign, but magnitudes distinct
    expect(Math.abs(projected[0][0])).toBeGreaterThan(0);
  });
});
