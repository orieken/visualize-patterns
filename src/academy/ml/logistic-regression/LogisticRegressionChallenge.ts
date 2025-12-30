export class LogisticRegressionChallenge {
  private m = 0;
  private b = 0;

  sigmoid(z: number): number {
    // TODO: Implement sigmoid: 1 / (1 + e^-z)
    return 0; // <-- FIX THIS
  }

  fit(x: number[], y: number[]) {
    // TODO: Implement Gradient Descent or assume pre-trained params
    // For challenge, maybe just ask them to implement predict logic?
    // Let's set some dummy weights that might work if predict is correct? 
    // No, better to force implementation. 
    // We can simulate training by setting m and b manually if they implement fit correctly.
    // Or ask them to write the prediction logic.
    
    // Simplification: We will set params here, they implement predict/sigmoid
    this.m = 1.5;
    this.b = -7; // Decision boundary approx x = 4.6
  }

  predict(x: number): number {
    // TODO: z = mx + b
    // prob = sigmoid(z)
    // return prob > 0.5 ? 1 : 0
    return -1; // <-- FIX THIS
  }
}
