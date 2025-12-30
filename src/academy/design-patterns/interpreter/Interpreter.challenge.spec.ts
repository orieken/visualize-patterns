import { describe, it, expect } from 'vitest';
import { AddExpression, NumberExpression, MinusExpression } from './InterpreterChallenge';

describe('Interpreter Challenge', () => {
  it('should add and subtract', () => {
    // 5 + 2 - 3 = 4
    const five = new NumberExpression(5);
    const two = new NumberExpression(2);
    const three = new NumberExpression(3);
    
    const add = new AddExpression(five, two);
    const result = new MinusExpression(add, three);
    
    expect(result.interpret()).toBe(4);
  });
});
