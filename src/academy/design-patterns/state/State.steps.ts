import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Document } from './State';
import { TrafficLight } from './StateChallenge';

// --- Reference Steps ---
let doc: Document;

Given('a Draft Document', function () {
  doc = new Document();
});

When('I publish it', function () {
  doc.publish();
});

Then('the status should take effect as {string}', function (status) {
  assert.strictEqual(doc.render(), status);
});


// --- Challenge
let light: TrafficLight;

Given('a Red TrafficLight', function () {
  light = new TrafficLight();
  // We assume default is Red, or test will fail if implemented differently
});

When('I change the light', function () {
  light.change();
});

When('I change the light again', function () {
  light.change();
});

Then('it becomes {string}', function (color) {
  assert.strictEqual(light.getColor(), color);
});
