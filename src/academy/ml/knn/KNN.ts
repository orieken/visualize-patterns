export class KNN {
  constructor(private k: number = 3) {}
  private points: number[] = [];
  private labels: number[] = [];

  fit(x: number[], y: number[]) {
    this.points = x;
    this.labels = y;
  }

  predict(x: number): number {
    // 1. Calculate distances
    const distances = this.points.map((p, i) => ({
      dist: Math.abs(p - x),
      label: this.labels[i]
    }));

    // 2. Sort by distance
    distances.sort((a, b) => a.dist - b.dist);

    // 3. Get top k
    const kNearest = distances.slice(0, this.k);

    // 4. Vote
    const votes = kNearest.reduce((acc, curr) => {
      acc[curr.label] = (acc[curr.label] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Simple max vote
    let maxVote = -1;
    let maxLabel = -1;
    for (const [label, count] of Object.entries(votes)) {
      if (count > maxVote) {
        maxVote = count;
        maxLabel = parseInt(label);
      }
    }
    return maxLabel;
  }
}
