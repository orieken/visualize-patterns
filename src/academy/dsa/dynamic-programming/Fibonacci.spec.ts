import { describe, it, expect } from 'vitest';
import { fibonacci } from './Fibonacci';

describe('DP Fibonacci (Reference)', () => {
  it('should calculate fib', () => {
    // 0 1 1 2 3 5 8 ...
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(5)).toBe(5);
    expect(fibonacci(6)).toBe(8);
  });
});
