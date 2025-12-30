export class SVM {
  public w: number[] = [];
  public b = 0;
  private learningRate = 0.001;
  private lambda = 0.01; // Regularization strength

  fit(X: number[][], y: number[], iterations = 1000) {
    // Simple PEGASOS algorithm (Primal Estimated sub-GrAdient SOlver for SVM)
    // Assumes labels are -1 and 1
    const nFeatures = X[0].length;
    this.w = new Array(nFeatures).fill(0);

    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < X.length; j++) {
            const condition = y[j] * (this.dot(X[j], this.w) + this.b) >= 1;
            if (condition) {
                // Correctly classified outside margin: only regularize w
                this.w = this.w.map(wi => wi - this.learningRate * (2 * this.lambda * wi));
            } else {
                // Misclassified or inside margin
                this.w = this.w.map((wi, k) => wi - this.learningRate * (2 * this.lambda * wi - X[j][k] * y[j]));
                this.b -= this.learningRate * (-y[j]);
            }
        }
    }
  }

  predict(x: number[]): number {
    const val = this.dot(x, this.w) + this.b;
    return val >= 0 ? 1 : -1;
  }

  private dot(a: number[], b: number[]) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }
}
