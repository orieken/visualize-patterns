import { describe, it, expect } from 'vitest';
import { NeuralNetwork } from './NeuralNetwork';

describe('Neural Network (Reference)', () => {
  it('should learn OR gate logic', () => {
    // 0,0 -> 0; 0,1 -> 1; 1,0 -> 1; 1,1 -> 1
    const X = [[0,0], [0,1], [1,0], [1,1]];
    const y = [0, 1, 1, 1];
    
    const nn = new NeuralNetwork(2);
    nn.fit(X, y, 1000);
    
    expect(nn.predict([0,0])).toBeLessThan(0.2);
    expect(nn.predict([1,0])).toBeGreaterThan(0.8);
  });
});
