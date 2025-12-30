import { describe, it, expect } from 'vitest';
import { TreeFactory, Tree } from './Flyweight';

describe('Flyweight Pattern (Reference)', () => {
  it('should share common state', () => {
    const type1 = TreeFactory.getTreeType('Oak', 'Green', 'Rough');
    const type2 = TreeFactory.getTreeType('Oak', 'Green', 'Rough');
    
    expect(type1).toBe(type2); // Same object reference
    
    const tree1 = new Tree(0, 0, type1);
    const tree2 = new Tree(10, 10, type2);
    
    expect(tree1.type).toBe(tree2.type);
    expect(tree1.x).not.toBe(tree2.x);
  });
});
