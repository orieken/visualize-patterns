import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { fibonacci } from './Fibonacci';
import { fibonacciChallenge } from './FibonacciChallenge';

let n: number;
let result: number;

Given('N is {int}', function (val) { n = val; });
When('I run Reference Fibonacci', function () { result = fibonacci(n); });
Then('the result should be {int}', function (val) { assert.strictEqual(result, val); });

// --- Challenge
let cn: number;
let cResult: number;

Given('Challenge N is {int}', function (val) { cn = val; });
When('I run Challenge Fib', function () { cResult = fibonacciChallenge(cn); });
Then('the Challenge result should be {int}', function (val) { assert.strictEqual(cResult, val); });
