import { describe, it, expect } from 'vitest';
import { Leaf, Composite } from './Composite';

describe('Composite Pattern (Reference)', () => {
  it('should compose objects into tree structures', () => {
    const tree = new Composite();
    const branch1 = new Composite();
    
    branch1.add(new Leaf());
    branch1.add(new Leaf());
    
    tree.add(branch1);
    tree.add(new Leaf());
    
    // Structure: Tree -> [Branch1 -> [Leaf, Leaf], Leaf]
    expect(tree.operation()).toBe('Branch(Branch(Leaf+Leaf)+Leaf)');
  });
});
