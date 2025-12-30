import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { DecisionTree } from './DecisionTree';
import { DecisionTreeChallenge } from './DecisionTreeChallenge';

// --- Reference Steps ---
let dt: DecisionTree;
let dtRes: number;

Given('a decision tree with rule "x < 5"', function () {
  dt = new DecisionTree();
  dt.fit([], []);
});

When('I predict inputs below 5', function () {
  dtRes = dt.predict([4]);
});

Then('result is class {int}', function (cls) {
  assert.strictEqual(dtRes, cls);
});

When('I predict inputs above 5', function () {
  dtRes = dt.predict([6]);
});


// --- Challenge
let cDt: DecisionTreeChallenge;
let cDtRes: number;

Given('a challenge tree split at 10', function () {
  cDt = new DecisionTreeChallenge();
  cDt.fit([], []);
});

When('I DT-predict {int}', function (val) {
  cDtRes = cDt.predict([val]);
});

Then('the DT-class is {int}', function (cls) {
  assert.strictEqual(cDtRes, cls);
});
