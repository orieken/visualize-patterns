import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { quickSort } from './QuickSort';
import { quickSortChallenge } from './QuickSortChallenge';

let input: number[];
let result: number[];

Given('a list of numbers {string}', function (str) {
  input = str.split(',').map((s: string) => parseInt(s.trim()));
});

When('I run Reference QuickSort', function () {
  result = quickSort(input);
});

When('I run Challenge QuickSort', function () {
  result = quickSortChallenge(input);
});

Then('the sorted list should be {string}', function (str) {
  const expected = str.split(',').map((s: string) => parseInt(s.trim()));
  assert.deepEqual(result, expected);
});
