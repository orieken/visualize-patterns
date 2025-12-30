export class WeakLearner {
  fit(X: number[], y: number[]) {
    // Just learn the mean of residuals for simplicity
    const sum = y.reduce((a, b) => a + b, 0);
    this.value = sum / y.length;
  }
  value = 0;
  predict(x: number) { return this.value; }
}

export class GradientBoosting {
  public learners: WeakLearner[] = [];
  learningRate = 0.1;

  fit(X: number[], y: number[], iterations = 5) {
    let residuals = [...y];
    
    for (let i = 0; i < iterations; i++) {
        const learner = new WeakLearner();
        learner.fit(X, residuals);
        this.learners.push(learner);
        
        // Update residuals
        residuals = residuals.map((r, idx) => r - this.learningRate * learner.predict(X[idx]));
    }
  }

  predict(x: number): number {
    let sum = 0;
    for (const l of this.learners) {
        sum += this.learningRate * l.predict(x);
    }
    return sum;
  }
}
