import { describe, it, expect } from 'vitest';
import { UnionFind } from './UnionFind';

describe('Union Find (Reference)', () => {
  it('should connect elements', () => {
    const uf = new UnionFind(10);
    
    // Initially disjoint
    expect(uf.connected(0, 1)).toBe(false);
    
    // Union
    uf.union(0, 1);
    expect(uf.connected(0, 1)).toBe(true);
    
    // Transitive
    uf.union(1, 2);
    expect(uf.connected(0, 2)).toBe(true);
    
    // Disjoint
    expect(uf.connected(0, 3)).toBe(false);
  });
});
