/**
 * CHALLENGE: Implement Linear Regression using Gradient Descent or Slope Formula.
 * You can choose simpler formula:
 * m = covariance(x, y) / variance(x)
 * b = mean(y) - m * mean(x)
 */
export class LinearRegressionChallenge {
  private m = 0;
  private b = 0;

  fit(x: number[], y: number[]) {
    // TODO: Calculate slope (m) and intercept (b)
  }

  predict(x: number): number {
    // TODO: y = mx + b
    return 0; // <-- FIX THIS
  }
}
