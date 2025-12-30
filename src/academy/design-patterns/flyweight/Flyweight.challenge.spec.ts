import { describe, it, expect } from 'vitest';
import { CharacterFactory } from './FlyweightChallenge';

describe('Flyweight Challenge', () => {
  it('should reuse character objects', () => {
    const c1 = CharacterFactory.getCharacter('Arial', 12);
    const c2 = CharacterFactory.getCharacter('Arial', 12);
    
    expect(c1).toBe(c2);
  });
});
