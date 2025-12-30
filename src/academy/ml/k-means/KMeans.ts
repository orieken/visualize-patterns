export class KMeans {
  constructor(private k: number = 2) {}
  public centroids: number[][] = [];
  public assignments: number[] = [];

  fit(data: number[][], iterations = 10) {
    if (data.length === 0) return;
    
    // 1. Initialize centroids randomly (for stability, take first k points here)
    this.centroids = data.slice(0, this.k);
    
    for (let i = 0; i < iterations; i++) {
        // 2. Assign clusters
        this.assignments = data.map(point => this.getNearestCentroidIndex(point));
        
        // 3. Update centroids
        const sums = new Array(this.k).fill(0).map(() => new Array(data[0].length).fill(0));
        const counts = new Array(this.k).fill(0);
        
        data.forEach((point, idx) => {
            const clusterId = this.assignments[idx];
            counts[clusterId]++;
            for (let dim = 0; dim < point.length; dim++) {
                sums[clusterId][dim] += point[dim];
            }
        });
        
        this.centroids = sums.map((sum, idx) => {
            if (counts[idx] === 0) return this.centroids[idx]; // No change if empty
            return sum.map(val => val / counts[idx]);
        });
    }
  }

  predict(point: number[]): number {
    return this.getNearestCentroidIndex(point);
  }

  private getNearestCentroidIndex(point: number[]): number {
    let minDist = Infinity;
    let idx = -1;
    this.centroids.forEach((centroid, i) => {
        const dist = Math.sqrt(point.reduce((acc, val, d) => acc + (val - centroid[d]) ** 2, 0));
        if (dist < minDist) {
            minDist = dist;
            idx = i;
        }
    });
    return idx;
  }
}
