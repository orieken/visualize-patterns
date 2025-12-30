import { describe, it, expect } from 'vitest';
import { quickSortChallenge } from './QuickSortChallenge';

describe('Quick Sort Challenge', () => {
  it('should sort array', () => {
    expect(quickSortChallenge([3, 1, 2])).toEqual([1, 2, 3]);
  });
});
