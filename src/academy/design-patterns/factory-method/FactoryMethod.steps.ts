import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { RoadLogistics, SeaLogistics, Logistics } from './FactoryMethod';
import { WindowsDialog, WebDialog, Dialog } from './FactoryMethodChallenge';

// --- Reference Steps ---
let logistics: Logistics;
let deliveryResult: string;

Given('a "RoadLogistics" creator', function () {
  logistics = new RoadLogistics();
});

Given('a "SeaLogistics" creator', function () {
  logistics = new SeaLogistics();
});

When('I ask it to plan delivery', function () {
  deliveryResult = logistics.planDelivery();
});

Then('the result should contain {string}', function (outcome) {
  assert.ok(deliveryResult.includes(outcome), `Expected "${deliveryResult}" to include "${outcome}"`);
});

// --- Challenge Steps ---
let dialog: Dialog;
let renderResult: string;

Given('I have a "WindowsDialog"', function () {
  dialog = new WindowsDialog();
});

Given('I have a "WebDialog"', function () {
  dialog = new WebDialog();
});

When('I render the window', function () {
  renderResult = dialog.renderWindow();
});

Then('it should mention {string}', function (outcome) {
  assert.ok(renderResult.includes(outcome), `Expected "${renderResult}" to include "${outcome}"`);
});
