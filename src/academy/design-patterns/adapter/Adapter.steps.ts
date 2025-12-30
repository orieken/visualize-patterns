import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Adapter, Adaptee } from './Adapter';
import { SensorAdapter } from './AdapterChallenge';

// --- Reference Steps ---
let adapter: Adapter;
let result: string;

Given('an Adaptee with reversed text', function () {
  adapter = new Adapter(new Adaptee());
});

When('I use the Adapter', function () {
  result = adapter.request();
});

Then('the result should be readable text {string}', function (txt) {
  assert.ok(result.includes(txt));
});

// --- Challenge
let cAdapter: SensorAdapter;
let cTemp: number;

Given('a Fahrenheit Sensor reading 100', function () {
  // Hardcoded in class for simplicity
  cAdapter = new SensorAdapter();
});

When('I read from the Adapter', function () {
  cTemp = cAdapter.getTemperatureInCelsius();
});

Then('the Celsius value should be approx {float}', function (val) {
  assert.ok(Math.abs(cTemp - val) < 0.1, `Expected ${val}, got ${cTemp}`);
});
