export class LogisticRegression {
  private m = 0;
  private b = 0;

  sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }

  fit(x: number[], y: number[]) {
    // Simplified Gradient Descent for 1D
    // Assume we run a fixed number of iterations for demonstration
    const learningRate = 0.1;
    const iterations = 1000;
    const n = x.length;

    for (let i = 0; i < iterations; i++) {
      let gradientM = 0;
      let gradientB = 0;
      
      for (let j = 0; j < n; j++) {
        const prediction = this.sigmoid(this.m * x[j] + this.b);
        const error = prediction - y[j];
        gradientM += error * x[j];
        gradientB += error;
      }
      
      this.m -= (learningRate * gradientM) / n;
      this.b -= (learningRate * gradientB) / n;
    }
  }

  predict(x: number): number {
    const prob = this.sigmoid(this.m * x + this.b);
    return prob >= 0.5 ? 1 : 0;
  }
}
