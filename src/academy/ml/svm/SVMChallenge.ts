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
    // TODO: Calculate dot product w*x + b
    // TODO: Return sign (1 or -1)
    return 0; // <-- FIX THIS
  }
}
