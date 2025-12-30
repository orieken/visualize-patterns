import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { UnionFind } from './UnionFind';
import { UnionFindChallenge } from './UnionFindChallenge';

// --- Reference Steps ---
let uf: UnionFind;

Given('a UnionFind of size {int}', function (size) {
  uf = new UnionFind(size);
});

When('I union {int} and {int}', function (a, b) {
  uf.union(a, b);
});

Then('{int} and {int} should be connected', function (a, b) {
  assert.strictEqual(uf.connected(a, b), true);
});

Then('{int} and {int} should not be connected', function (a, b) {
  assert.strictEqual(uf.connected(a, b), false);
});


// --- Challenge Steps ---
let cuf: UnionFindChallenge;

Given('a Challenge UnionFind of size {int}', function (size) {
  cuf = new UnionFindChallenge(size);
});

When('I challenge-union {int} and {int}', function (a, b) {
  cuf.union(a, b);
});

Then('{int} and {int} should be challenge-connected', function (a, b) {
  assert.strictEqual(cuf.connected(a, b), true, `Expected ${a} and ${b} to be connected`);
});
