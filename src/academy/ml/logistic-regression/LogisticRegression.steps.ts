import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { LogisticRegression } from './LogisticRegression';
import { LogisticRegressionChallenge } from './LogisticRegressionChallenge';

// --- Reference Steps ---
let lr: LogisticRegression;
let pred: number;

Given('training data x=[1,2,8,9] and labels y=[0,0,1,1]', function () {
  lr = new LogisticRegression();
  lr.fit([1, 2, 8, 9], [0, 0, 1, 1]);
});

When('I train the logistic model', function () {
  // Done in Given
});

Then('predicting x={float} should be class {int}', function (x, cls) {
  assert.strictEqual(lr.predict(x), cls);
});


// --- Challenge
let clr: LogisticRegressionChallenge;
let cPred: number;

Given('a LogisticChallenge model with fixed weights', function () {
  clr = new LogisticRegressionChallenge();
  clr.fit([], []);
});

When('I predict for input {int}', function (x) {
  cPred = clr.predict(x);
});

Then('the Logistic-class should be {int}', function (cls) {
  assert.strictEqual(cPred, cls);
});
