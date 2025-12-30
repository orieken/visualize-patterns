import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { RandomForest } from './RandomForest';
import { RandomForestChallenge } from './RandomForestChallenge';

// --- Reference Steps ---
let rf: RandomForest;
let rfRes: number;

Given('a forest with 3 trees', function () {
  rf = new RandomForest(3);
  rf.fit([], []);
});

When('I predict input {int}', function (val) {
  rfRes = rf.predict([val]);
});

Then('the majority vote should be {int}', function (cls) {
  assert.strictEqual(rfRes, cls);
});


// --- Challenge
let cRf: RandomForestChallenge;
let cRfRes: number;

Given('a challenge forest', function () {
  cRf = new RandomForestChallenge(3);
  cRf.fit([], []);
});

When('I predict input {int} with challenge', function (val) {
  // Disambiguate from reference step using 'with challenge' or keep distinct context
  cRfRes = cRf.predict([val]);
});

Then('the result is {int}', function (cls) {
  assert.strictEqual(cRfRes, cls);
});
