import { describe, it, expect } from 'vitest';
import { Sheep } from './PrototypeChallenge';

describe('Prototype Challenge', () => {
  it('should clone the sheep', () => {
    const dolly = new Sheep('Dolly', 'Mountain Sheep');
    const clone = dolly.clone();
    
    expect(clone).not.toBe(dolly); // Must be different instance
    expect(clone.name).toBe('Dolly');
  });
});
