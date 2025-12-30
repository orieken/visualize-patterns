import { describe, it, expect } from 'vitest';
import { kmpSearchChallenge } from './KMPChallenge';

describe('KMP Challenge', () => {
  it('should find patterns', () => {
    expect(kmpSearchChallenge('AABAACAADAABAABA', 'AABA')).toEqual([0, 9, 12]);
  });
});
