import { describe, it, expect } from 'vitest';
import { KMeans } from './KMeans';

describe('K-Means (Reference)', () => {
  it('should cluster separated data', () => {
    // Cluster 0: near [0,0]
    // Cluster 1: near [10,10]
    const data = [[0,0], [1,1], [10,10], [11,11]];
    
    const kmeans = new KMeans(2);
    kmeans.fit(data);
    
    expect(kmeans.predict([0.5, 0.5])).toBe(0);
    expect(kmeans.predict([10.5, 10.5])).toBe(1);
  });
});
