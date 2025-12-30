export class KNNChallenge {
  constructor(private k: number = 3) {}
  private points: number[] = [];
  private labels: number[] = [];

  fit(x: number[], y: number[]) {
    this.points = x;
    this.labels = y;
  }

  predict(x: number): number {
    // TODO:
    // 1. Calculate distances from x to all this.points
    // 2. Sort by distance
    // 3. Take first k
    // 4. Return most common label
    return -1; // <-- FIX THIS
  }
}
