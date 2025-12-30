export class KMeansChallenge {
  constructor(private k: number = 2) {}
  public centroids: number[][] = [];

  fit(data: number[][], iterations = 10) {
    if (data.length === 0) return;
    this.centroids = data.slice(0, this.k);

    for (let i = 0; i < iterations; i++) {
        // TODO:
        // 1. Assign points to nearest centroid
        // 2. Re-calculate centroids based on mean of assigned points
    }
  }

  predict(point: number[]): number {
    // TODO: Find distance to each centroid, return index of closest
    return -1; // <-- FIX THIS
  }
}
