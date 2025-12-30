import { describe, it, expect } from 'vitest';
import { Constant, Variable, AndExpression, OrExpression } from './Interpreter';

describe('Interpreter Pattern (Reference)', () => {
  it('should evaluate boolean expressions', () => {
    // (x AND y) OR z
    const x = new Variable('x');
    const y = new Variable('y');
    const z = new Variable('z');
    
    const expr = new OrExpression(
      new AndExpression(x, y),
      z
    );

    const context = { x: true, y: false, z: true };
    expect(expr.interpret(context)).toBe(true);
  });
});
