import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { ComputerFacade } from './Facade';
import { ConverterFacade } from './FacadeChallenge';

// --- Reference Steps ---
let computer: ComputerFacade;
let startupLogs: string[];

Given('a ComputerFacade', function () {
  computer = new ComputerFacade();
});

When('I start the computer', function () {
  startupLogs = computer.startComputer();
});

Then('I should see {string}', function (msg) {
  assert.ok(startupLogs.includes(msg));
});

// --- Challenge
let converter: ConverterFacade;
let cStatus: string;

Given('a ConverterFacade', function () {
  converter = new ConverterFacade();
});

When('I convert {string} to {string}', function (file, fmt) {
  cStatus = converter.convert(file, fmt);
});

Then('the status should be {string}', function (status) {
  assert.strictEqual(cStatus, status);
});
