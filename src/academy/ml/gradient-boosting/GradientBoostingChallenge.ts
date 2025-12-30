export class WeakLearner {
  value = 0;
  fit(X: number[], y: number[]) {
    this.value = y.reduce((a, b) => a + b, 0) / y.length;
  }
  predict(x: number) { return this.value; }
}

export class GradientBoostingChallenge {
  public learners: WeakLearner[] = [];
  learningRate = 0.1;

  fit(X: number[], y: number[], iterations = 5) {
    let residuals = [...y];
    
    for (let i = 0; i < iterations; i++) {
        const learner = new WeakLearner();
        learner.fit(X, residuals);
        this.learners.push(learner);
        
        // TODO: Update residuals!
        // residuals = residuals - learningRate * prediction
    }
  }

  predict(x: number): number {
    // TODO: Sum up predictions * learningRate
    return 0; // <-- FIX THIS
  }
}
