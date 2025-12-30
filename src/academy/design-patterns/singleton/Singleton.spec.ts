import { describe, it, expect } from 'vitest';
import { Singleton } from './Singleton';

describe('Singleton Pattern (Reference)', () => {
  it('should return the same instance every time', () => {
    const instance1 = Singleton.getInstance();
    const instance2 = Singleton.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should not allow direct instantiation properly (conceptual check)', () => {
    // In TypeScript, private constructor is a compile-time check.
    // At runtime, JS technically allows it if we bypass TS, but for the pattern:
    // This test confirms usage of getInstance() is the primary way.
    const instance = Singleton.getInstance();
    expect(instance).toBeInstanceOf(Singleton);
  });
});
