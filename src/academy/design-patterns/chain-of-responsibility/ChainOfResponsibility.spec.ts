import { describe, it, expect } from 'vitest';
import { MonkeyHandler, SquirrelHandler, DogHandler } from './ChainOfResponsibility';

describe('Chain of Responsibility (Reference)', () => {
  it('should pass requests along the chain', () => {
    const monkey = new MonkeyHandler();
    const squirrel = new SquirrelHandler();
    const dog = new DogHandler();

    monkey.setNext(squirrel).setNext(dog);

    expect(monkey.handle('Banana')).toBe("Monkey: I'll eat the Banana.");
    expect(monkey.handle('Nut')).toBe("Squirrel: I'll eat the Nut.");
    expect(monkey.handle('MeatBall')).toBe("Dog: I'll eat the MeatBall.");
    expect(monkey.handle('Coffee')).toBeNull();
  });
});
