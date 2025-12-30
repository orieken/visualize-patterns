import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Robot } from './Prototype';
import { Sheep } from './PrototypeChallenge';

// --- Reference Steps ---
let originalRobot: Robot;
let clonedRobot: Robot;

Given('an original robot {string} with directive {string}', function (name, dir) {
  originalRobot = new Robot(name, 100, [dir]);
});

When('I clone the robot', function () {
  clonedRobot = originalRobot.clone();
});

When('I add {string} directive to the clone', function (dir) {
  clonedRobot.addDirective(dir);
});

Then('the original robot should still calculate only {string}', function (dirs) {
  assert.deepEqual(originalRobot.knownDirectives, dirs.split(', '));
});

Then('the clone should calculate {string}', function (dirs) {
  assert.deepEqual(clonedRobot.knownDirectives, dirs.split(', '));
});


// --- Challenge Steps ---
let originalSheep: Sheep;
let clonedSheep: Sheep;

Given('a sheep named {string}', function (name) {
  originalSheep = new Sheep(name, 'Generic');
});

When('I verify the clone', function () {
  clonedSheep = originalSheep.clone();
});

Then('the clone should be a separate object with name {string}', function (name) {
  assert.notStrictEqual(clonedSheep, originalSheep, 'Clone is same instance as original!');
  assert.strictEqual(clonedSheep.name, name);
});
