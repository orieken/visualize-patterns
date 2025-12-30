import { describe, it, expect } from 'vitest';
import { UnionFindChallenge } from './UnionFindChallenge';

describe('Union Find Challenge', () => {
  it('should support union and find operations', () => {
    const uf = new UnionFindChallenge(5);
    uf.union(0, 1);
    expect(uf.connected(0, 1)).toBe(true);
  });
});
