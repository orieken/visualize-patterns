import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { PCA } from './PCA';
import { PCAChallenge } from './PCAChallenge';

// --- Reference Steps ---
let pca: PCA;
let pcaRes: number[][];

Given('data points [1,1], [2,2], [3,3]', function () {
  pca = new PCA(1);
});

When('I apply PCA to 1 component', function () {
  const data = [[1, 1], [2, 2], [3, 3]];
  pcaRes = pca.fitTransform(data);
});

Then('the projected values should preserve the order', function () {
  // Check strict increasing or strict decreasing
  const v1 = pcaRes[0][0];
  const v2 = pcaRes[1][0];
  const v3 = pcaRes[2][0];
  const increasing = v1 < v2 && v2 < v3;
  const decreasing = v1 > v2 && v2 > v3;
  assert.ok(increasing || decreasing);
});


// --- Challenge
let cPca: PCAChallenge;
let cPcaRes: number[][];

Given('2D data that is diagonal', function () {
  cPca = new PCAChallenge(1);
});

When('I challenge-PCA to 1D', function () {
  const data = [[1, 1], [2, 2]];
  cPcaRes = cPca.fitTransform(data);
});

Then('I should get a 1D result', function () {
  assert.strictEqual(cPcaRes.length, 2);
  assert.strictEqual(cPcaRes[0].length, 1);
});
