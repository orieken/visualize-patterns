import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { NeuralNetwork } from './NeuralNetwork';
import { NeuralNetworkChallenge } from './NeuralNetworkChallenge';

// --- Reference Steps ---
let nn: NeuralNetwork;

Given('training data for OR gate', function () {
  nn = new NeuralNetwork(2);
  const X = [[0,0], [0,1], [1,0], [1,1]];
  const y = [0, 1, 1, 1];
  nn.fit(X, y, 1000);
});

When('I train the perceptron', function () {
  // Done in Given
});

Then('it should output near {int} for [{int},{int}]', function (target, x1, x2) {
  const pred = nn.predict([x1, x2]);
  if (target === 0) assert.ok(pred < 0.2, `Expected < 0.2, got ${pred}`);
  else assert.ok(pred > 0.8, `Expected > 0.8, got ${pred}`);
});


// --- Challenge
let cNn: NeuralNetworkChallenge;
let cPred: number;

Given('an initialized network', function () {
  cNn = new NeuralNetworkChallenge(2);
});

When('I pass input [{int}, {int}]', function (x1, x2) {
  cPred = cNn.predict([x1, x2]);
});

Then('I should get a numerical output', function () {
  assert.strictEqual(typeof cPred, 'number');
  // challenge skeleton returns 0, which is a number.
  // Real implementation might return random 0-1.
});
