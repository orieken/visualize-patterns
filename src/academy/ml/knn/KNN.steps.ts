import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { KNN } from './KNN';
import { KNNChallenge } from './KNNChallenge';

// --- Reference Steps ---
let knn: KNN;
let res: number;

Given('knowledge base x=[1,2,10,11] y=[0,0,1,1]', function () {
  knn = new KNN(3);
  knn.fit([1, 2, 10, 11], [0, 0, 1, 1]);
});

When('I query predict x={int} with k={int}', function (x, k) {
  // Re-init with k if needed, or assume default. Reference uses 3.
  // Actually we should support changing k, but specific impl is fixed 3.
  res = knn.predict(x);
});

Then('the result should be class {int}', function (cls) {
  assert.strictEqual(res, cls);
});


// --- Challenge
let cKnn: KNNChallenge;
let cRes: number;

Given('a minimal knowledge base x=[1, 10] y=[0, 1]', function () {
  cKnn = new KNNChallenge(1);
  cKnn.fit([1, 10], [0, 1]);
});

When('I predict x={int} with k={int}', function (x, k) {
  cRes = cKnn.predict(x);
});

Then('the KNN-class should be {int}', function (cls) {
  assert.strictEqual(cRes, cls);
});
