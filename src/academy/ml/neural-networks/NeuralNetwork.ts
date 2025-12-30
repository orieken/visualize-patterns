export class NeuralNetwork {
  private weights: number[];
  private bias: number;

  constructor(inputSize: number) {
    // Single Neuron for simplicity (Perceptron)
    this.weights = new Array(inputSize).fill(Math.random());
    this.bias = Math.random();
  }

  // Sigmoid activation
  private sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

  predict(inputs: number[]): number {
    const sum = inputs.reduce((acc, val, i) => acc + val * this.weights[i], 0) + this.bias;
    return this.sigmoid(sum);
  }

  fit(X: number[][], y: number[], epochs = 100) {
    const lr = 0.1;
    for (let e = 0; e < epochs; e++) {
        for (let i = 0; i < X.length; i++) {
            const pred = this.predict(X[i]);
            const error = y[i] - pred;
            // Update
            for (let j = 0; j < this.weights.length; j++) {
                this.weights[j] += lr * error * X[i][j];
            }
            this.bias += lr * error;
        }
    }
  }
}
