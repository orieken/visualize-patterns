export interface MathExpression {
  interpret(): number;
}

export class NumberExpression implements MathExpression {
  constructor(private num: number) {}
  interpret() { return this.num; }
}

/**
 * CHALLENGE: Implement AddExpression and MinusExpression.
 * Support parsing "1 + 2" or manual composition.
 * For simplicity, manual composition is fine.
 * new Add(new Num(1), new Num(2)) -> 3
 */
export class AddExpression implements MathExpression {
  constructor(private left: MathExpression, private right: MathExpression) {}

  interpret(): number {
    // TODO: left + right
    return 0; // <-- FIX THIS
  }
}

export class MinusExpression implements MathExpression {
  constructor(private left: MathExpression, private right: MathExpression) {}
  
  interpret(): number {
    return 0; // <-- FIX THIS
  }
}
