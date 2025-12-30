import { describe, it, expect } from 'vitest';
import { mergeSort } from './MergeSort';

describe('Merge Sort (Reference)', () => {
  it('should sort an unsorted array', () => {
    const input = [5, 3, 8, 4, 2];
    expect(mergeSort(input)).toEqual([2, 3, 4, 5, 8]);
  });
});
