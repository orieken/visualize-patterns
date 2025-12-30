import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { TV, RemoteControl } from './Bridge';
import { VectorRenderer, Circle } from './BridgeChallenge';

// --- Reference Steps ---
let tv: TV;
let remote: RemoteControl;

Given('a TV device', function () {
  tv = new TV();
});

Given('I have a RemoteControl paired with it', function () {
  remote = new RemoteControl(tv);
});

When('I toggle power on the remote', function () {
  remote.togglePower();
});

Then('the TV should be enabled', function () {
  assert.strictEqual(tv.isEnabled(), true);
});

// --- Challenge
let renderer: VectorRenderer;
let circle: Circle;
let drawOutput: string;

Given('a VectorRenderer', function () {
  renderer = new VectorRenderer();
});

Given('a Circle of radius {int}', function (r) {
  circle = new Circle(renderer, r);
});

When('I draw the circle', function () {
  drawOutput = circle.draw();
});

Then('the output should be {string}', function (str) {
  assert.strictEqual(drawOutput, str);
});
