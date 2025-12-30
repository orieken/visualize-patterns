import { describe, it, expect } from 'vitest';
import { fibonacciChallenge } from './FibonacciChallenge';

describe('DP Fibonacci Challenge', () => {
  it('should calculate', () => {
    expect(fibonacciChallenge(6)).toBe(8);
  });
});
