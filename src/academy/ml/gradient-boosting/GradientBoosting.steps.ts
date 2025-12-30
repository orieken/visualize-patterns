import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { GradientBoosting } from './GradientBoosting';
import { GradientBoostingChallenge } from './GradientBoostingChallenge';

// --- Reference Steps ---
let gb: GradientBoosting;
let gbRes: number;

Given('a target value of 10', function () {
  // Implicit setup
});

When('I train boosting for 50 iterations', function () {
  gb = new GradientBoosting();
  gb.fit([1], [10], 50);
  gbRes = gb.predict(1);
});

Then('the prediction should be close to 10', function () {
  assert.ok(Math.abs(gbRes - 10) < 1, `Got ${gbRes}`);
});


// --- Challenge
let cGb: GradientBoostingChallenge;
let cGbRes: number;

Given('a boosting model with 2 learners predicting 10', function () {
  cGb = new GradientBoostingChallenge();
  cGb.learners.push({ predict: () => 10, fit: () => {}, value: 10 });
  cGb.learners.push({ predict: () => 10, fit: () => {}, value: 10 });
});

When('I predict with learning rate 0.1', function () {
  cGb.learningRate = 0.1;
  cGbRes = cGb.predict(1);
});

Then('the total should be 2', function () {
  assert.strictEqual(cGbRes, 2);
});
