import { describe, it, expect } from 'vitest';
import { mergeSortChallenge } from './MergeSortChallenge';

describe('Merge Sort Challenge', () => {
  it('should sort numbers', () => {
    expect(mergeSortChallenge([10, 1])).toEqual([1, 10]);
  });
});
