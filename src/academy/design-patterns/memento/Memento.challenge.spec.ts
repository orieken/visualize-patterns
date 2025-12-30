import { describe, it, expect } from 'vitest';
import { Game } from './MementoChallenge';

describe('Memento Challenge', () => {
  it('should save game progress', () => {
    const game = new Game();
    game.level = 5;
    game.health = 50;
    
    const save = game.save();
    
    game.play(); // level 6, health 40
    
    game.load(save);
    expect(game.level).toBe(5);
    expect(game.health).toBe(50);
  });
});
