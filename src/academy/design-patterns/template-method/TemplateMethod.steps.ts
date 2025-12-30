import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { PDFMiner } from './TemplateMethod';
import { Tea } from './TemplateMethodChallenge';

// --- Reference Steps ---
let miner: PDFMiner;
let result: string;

Given('a PDFMiner', function () {
  miner = new PDFMiner();
});

When('I mine {string}', function (path) {
  result = miner.mine(path);
});

Then('the result should contain {string}', function (content) {
  assert.ok(result.includes(content));
});


// --- Challenge
let tea: Tea;
let steps: string[];

Given('a TeaMaker', function () {
  tea = new Tea();
});

When('I prepare the recipe', function () {
  steps = tea.prepareRecipe();
});

Then('the steps should include {string}', function (step) {
  assert.ok(steps.includes(step), `Expected steps ${steps} to include ${step}`);
});
