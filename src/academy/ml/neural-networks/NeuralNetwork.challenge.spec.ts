import { describe, it, expect } from 'vitest';
import { NeuralNetworkChallenge } from './NeuralNetworkChallenge';

describe('Neural Network Challenge', () => {
  it('should output prediction', () => {
    const nn = new NeuralNetworkChallenge(2);
    // Assuming user implements weights init basically
    expect(nn.predict([1, 1])).toBeDefined();
    // We can't strictly test correctness without training logic, 
    // but we can expect it to not throw and return number.
  });
});
