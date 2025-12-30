import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { ModernFactory, VictorianFactory, FurnitureFactory, Chair, Sofa } from './AbstractFactory';
import { Application } from './AbstractFactoryChallenge';

// --- Reference Steps ---
let furnitureFactory: FurnitureFactory;
let chair: Chair;
let sofa: Sofa;

Given('a "ModernFactory"', function () {
  furnitureFactory = new ModernFactory();
});

Given('a "VictorianFactory"', function () {
  furnitureFactory = new VictorianFactory();
});

When('I create a chair', function () {
  chair = furnitureFactory.createChair();
});

When('I create a sofa', function () {
  sofa = furnitureFactory.createSofa();
});

Then('the chair should be "Modern"', function () {
  assert.ok(chair.sitOn().includes('Modern'), 'Expected Modern chair');
});

Then('the sofa should be "Victorian"', function () {
  assert.ok(sofa.lieOn().includes('Victorian'), 'Expected Victorian sofa');
});

// --- Challenge Steps ---
// This part is tricky because the user hasn't created the classes yet.
// We can use "any" to bypass TS checks for the scaffolding, or comment it out until they implement it.
// For now, we'll try to instantiate dynamically or fail if not found.

let app: Application;
let paintResult: string;

Given('I configure the app with {string}', function (factoryName) {
  // In a real challenge, we'd expect the user to export these classes.
  // For the BDD framework to work before they finish, we might mock or skip.
  // Here we just accept the step but it will likely fail or throw if classes don't exist.
  // We'll simulate a dummy fail to guide them.
  try {
    // const FactoryClass = require('./AbstractFactoryChallenge')[factoryName];
    // app = new Application(new FactoryClass());
    // app.createUI();
  } catch (e) {
    // Ignore execution for now
  }
});

When('the app paints', function () {
  if (app) paintResult = app.paint();
  else paintResult = "Nothing";
});

Then('the result should be {string}', function (expected) {
  assert.strictEqual(paintResult, expected);
});
