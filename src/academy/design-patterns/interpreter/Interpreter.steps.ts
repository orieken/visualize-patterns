import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Variable, AndExpression, Expression } from './Interpreter';
import { NumberExpression, AddExpression, MathExpression } from './InterpreterChallenge';

// --- Reference Steps ---
let context: Record<string, boolean>;
let expr: Expression;
let boolResult: boolean;

Given('variables x={boolean}, y={boolean}', function (xVal, yVal) {
  context = { x: xVal, y: yVal };
});

Given('an expression "x AND y"', function () {
  expr = new AndExpression(new Variable('x'), new Variable('y'));
});

When('I interpret the expression', function () {
  boolResult = expr.interpret(context);
});

Then('the result should be {boolean}', function (expected) {
  assert.strictEqual(boolResult, expected);
});

// --- Challenge
let mathExpr: MathExpression;
let mathResult: number;

Given('the math expression {string}', function (str) {
  // Simple parser for "A plus B"
  const parts = str.split(' ');
  if (parts[1] === 'plus') {
    const left = new NumberExpression(parseInt(parts[0]));
    const right = new NumberExpression(parseInt(parts[2]));
    mathExpr = new AddExpression(left, right);
  }
});

When('I interpret the math', function () {
  mathResult = mathExpr.interpret();
});

Then('the math result should be {int}', function (val) {
  assert.strictEqual(mathResult, val);
});
