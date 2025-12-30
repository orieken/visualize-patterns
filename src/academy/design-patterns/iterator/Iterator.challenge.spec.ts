import { describe, it, expect } from 'vitest';
import { LinkedList, ListIterator } from './IteratorChallenge';

describe('Iterator Challenge', () => {
  it('should iterate linked list', () => {
    const list = new LinkedList<number>();
    list.add(1);
    list.add(2);
    
    const it = new ListIterator(list); // Or list.getIterator() if you implement it
    
    expect(it.hasNext()).toBe(true);
    expect(it.next()).toBe(1);
    expect(it.next()).toBe(2);
    expect(it.hasNext()).toBe(false);
  });
});
