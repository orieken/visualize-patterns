import { describe, it, expect } from 'vitest';
import { KMeansChallenge } from './KMeansChallenge';

describe('K-Means Challenge', () => {
  it('should find centroids', () => {
    const data = [[0], [10]];
    const kmeans = new KMeansChallenge(2);
    
    // Initial centroids will be [0] and [10] (first k points)
    // One iteration should keep them stable if they are far apart
    kmeans.fit(data); 

    expect(kmeans.predict([1])).toBe(0);
    expect(kmeans.predict([9])).toBe(1);
  });
});
