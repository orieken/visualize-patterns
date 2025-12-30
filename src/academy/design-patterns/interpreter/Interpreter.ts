export interface Expression {
  interpret(context: Record<string, boolean>): boolean;
}

export class Constant implements Expression {
  constructor(private value: boolean) {}
  interpret() { return this.value; }
}

export class Variable implements Expression {
  constructor(private name: string) {}
  interpret(context: Record<string, boolean>) { return context[this.name]; }
}

export class AndExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(context: Record<string, boolean>) {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

export class OrExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(context: Record<string, boolean>) {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}
