import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { KMeans } from './KMeans';
import { KMeansChallenge } from './KMeansChallenge';

// --- Reference Steps ---
let kmeans: KMeans;

Given('a dataset of [0,0] and [10,10]', function () {
  const data = [[0, 0], [1, 1], [10, 10], [11, 11]];
  kmeans = new KMeans(2);
  kmeans.fit(data);
});

When('I cluster into 2 groups', function () {
  // Done in Given
});

Then('[{float},{float}] should belong to the first cluster', function (x, y) {
  assert.strictEqual(kmeans.predict([x, y]), 0);
});

Then('[{float},{float}] should belong to the second cluster', function (x, y) {
  assert.strictEqual(kmeans.predict([x, y]), 1);
});


// --- Challenge
let cKmeans: KMeansChallenge;

Given('1D points 0 and 10', function () {
  // Dataset that clearly splits
  const data = [[0], [10]];
  cKmeans = new KMeansChallenge(2);
  cKmeans.fit(data);
});

When('I run Challenge K-Means k={int}', function (k) {
  // Done in Given
});

Then('{int} should be in cluster {int}', function (val, cls) {
  assert.strictEqual(cKmeans.predict([val]), cls);
});
