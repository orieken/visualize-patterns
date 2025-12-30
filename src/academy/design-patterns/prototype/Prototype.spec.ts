import { describe, it, expect } from 'vitest';
import { Robot } from './Prototype';

describe('Prototype Pattern (Reference)', () => {
  it('should create an independent clone', () => {
    const original = new Robot('R2D2', 100, ['Beep']);
    const clone = original.clone();
    
    // Check initial state
    expect(clone.model).toBe('R2D2');
    expect(clone).not.toBe(original); // Different instances
    
    // Modify clone
    clone.addDirective('Boop');
    
    // Original should stay same
    expect(original.knownDirectives).toEqual(['Beep']);
    expect(clone.knownDirectives).toEqual(['Beep', 'Boop']);
  });
});
