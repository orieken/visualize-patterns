import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { mergeSort } from './MergeSort';
import { mergeSortChallenge } from './MergeSortChallenge';

let input: number[];
let result: number[];

Given('an unsorted array {string}', function (arrStr) {
  input = arrStr.split(',').map(Number);
});

When('I run Reference Merge Sort', function () {
  result = mergeSort(input);
});

When('I run Challenge Merge Sort', function () {
  result = mergeSortChallenge(input);
});

Then('the result array should be {string}', function (expectedStr) {
  const expected = expectedStr.split(',').map(Number);
  assert.deepEqual(result, expected);
});
