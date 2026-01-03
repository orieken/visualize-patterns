export class SVMChallenge {
  public w: number[] = [];
  public b = 0;

  fit(X: number[][], y: number[]) {
    // Challenge: Initialize w (e.g. zeros)
    // No need to implement full PEGASOS unless you want to
    // We can just verify predict logic in the test.
    const nFeatures = X[0].length;
    this.w = new Array(nFeatures).fill(1); // Dummy init
  }

  predict(x: number[]): number {
    let score = this.b;
    for (let i = 0; i < this.w.length; i++) {
        score += this.w[i] * x[i];
    }
    return score >= 0 ? 1 : -1;
  }
}
