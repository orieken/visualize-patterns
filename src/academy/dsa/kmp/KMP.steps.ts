import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { kmpSearch } from './KMP';
import { kmpSearchChallenge } from './KMPChallenge';

let text: string;
let pattern: string;
let result: number[];

Given('a text {string}', function (t) { text = t; });
Given('a pattern {string}', function (p) { pattern = p; });

When('I run Reference KMP', function () {
  result = kmpSearch(text, pattern);
});

Then('the matches should be at indices {string}', function (indices) {
  const expected = indices.split(',').map((s:string) => parseInt(s.trim()));
  assert.deepEqual(result, expected);
});


// --- Challenge ---
let cText: string;
let cPattern: string;
let cResult: number[];

Given('a KMP text {string}', function (t) { cText = t; });
Given('a KMP pattern {string}', function (p) { cPattern = p; });

When('I run Challenge KMP', function () {
  cResult = kmpSearchChallenge(cText, cPattern);
});

Then('the Challenge matches should be at indices {string}', function (indices) {
  const expected = indices.split(',').map((s:string) => parseInt(s.trim()));
  assert.deepEqual(cResult, expected);
});
