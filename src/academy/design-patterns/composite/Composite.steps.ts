import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Composite, Leaf } from './Composite';
import { CompoundGraphic, Dot } from './CompositeChallenge';

// --- Reference Steps ---
let tree: Composite;
let opResult: string;

Given('a Composite Tree', function () {
  tree = new Composite();
});

Given('I add a Leaf to it', function () {
  tree.add(new Leaf());
});

When('I request operation', function () {
  opResult = tree.operation();
});

Then('the result should be {string}', function (res) {
  assert.strictEqual(opResult, res);
});


// --- Challenge
let group: CompoundGraphic;
let drawRes: string;

Given('a CompoundGraphic group', function () {
  group = new CompoundGraphic();
});

Given('I add a Dot to the group', function () {
  group.add(new Dot());
});

When('I draw the group', function () {
  drawRes = group.draw();
});

Then('the output should contain {string}', function (str) {
  assert.ok(drawRes.includes(str), `Expected ${drawRes} to include ${str}`);
});
