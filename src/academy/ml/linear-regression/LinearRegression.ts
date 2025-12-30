export class LinearRegression {
  private m = 0;
  private b = 0;

  fit(x: number[], y: number[]) {
    // Simple Least Squares implementation for reference
    const n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = (n * sumX2) - (sumX * sumX);

    this.m = numerator / denominator;
    this.b = (sumY - (this.m * sumX)) / n;
  }

  predict(x: number): number {
    return this.m * x + this.b;
  }
}
