import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { SVM } from './SVM';
import { SVMChallenge } from './SVMChallenge';

// --- Reference Steps ---
let svm: SVM;
let pred: number;

Given('training points -2,-1 class -1 and 1,2 class 1', function () {
  svm = new SVM();
  const X = [[-2], [-1], [1], [2]];
  const y = [-1, -1, 1, 1];
  svm.fit(X, y);
});

When('I train SVM', function () {
  // Done in Given
});

Then('{float} should be class {int}', function (x, cls) {
  assert.strictEqual(svm.predict([x]), cls);
}); // Handles both reference Then steps


// --- Challenge
let cSvm: SVMChallenge;
let cPred: number;

Given('an SVM with weights [{int}] and bias {int}', function (w, b) {
  cSvm = new SVMChallenge();
  cSvm.w = [w];
  cSvm.b = b;
});

When('I SVM-predict {int}', function (x) {
  cPred = cSvm.predict([x]);
});

Then('the SVM-class is {int}', function (cls) {
  assert.strictEqual(cPred, cls);
});
