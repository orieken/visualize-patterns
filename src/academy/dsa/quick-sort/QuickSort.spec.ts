import { describe, it, expect } from 'vitest';
import { quickSort } from './QuickSort';

describe('Quick Sort (Reference)', () => {
  it('should sort numbers', () => {
    const arr = [10, 5, 2, 3];
    expect(quickSort(arr)).toEqual([2, 3, 5, 10]);
  });
});
