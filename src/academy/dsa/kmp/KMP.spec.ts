import { describe, it, expect } from 'vitest';
import { kmpSearch } from './KMP';

describe('KMP (Reference)', () => {
  it('should find occurrences', () => {
    // Indices: 012345678
    // Text:    ABABDABAC
    // Pat:     ABABC
    expect(kmpSearch('ABABDABACDABABCABAB', 'ABABC')).toEqual([10]);
    expect(kmpSearch('AAAAA', 'AA')).toEqual([0, 1, 2, 3]);
  });
});
