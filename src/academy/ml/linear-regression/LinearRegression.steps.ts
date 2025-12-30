import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { LinearRegression } from './LinearRegression';
import { LinearRegressionChallenge } from './LinearRegressionChallenge';

// --- Reference Steps ---
let lr: LinearRegression;
let predictedY: number;

Given('training data x=[1,2,3], y=[3,5,7]', function () {
  lr = new LinearRegression();
  lr.fit([1, 2, 3], [3, 5, 7]);
});

When('I train the model', function () {
  // Already trained in Given for simplicity, but could split
});

Then('predicting x={int} should give {int}', function (x, y) {
  predictedY = lr.predict(x);
  assert.ok(Math.abs(predictedY - y) < 0.1);
});

// --- Challenge
let clr: LinearRegressionChallenge;
let cPred: number;

Given('training data x=[1,2,3] and y=[1,2,3]', function () {
  clr = new LinearRegressionChallenge();
  clr.fit([1, 2, 3], [1, 2, 3]);
});

When('I train the challenge model', function () {
});

Then('predicting x={int} should be {int}', function (x, y) {
  cPred = clr.predict(x);
  assert.ok(Math.abs(cPred - y) < 0.1);
});
