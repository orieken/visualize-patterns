import { describe, it, expect } from 'vitest';
import { Book, BookShelf } from './Iterator';

describe('Iterator Pattern (Reference)', () => {
  it('should iterate over books', () => {
    const shelf = new BookShelf();
    shelf.appendBook(new Book('A'));
    shelf.appendBook(new Book('B'));
    
    const it = shelf.createIterator();
    const result = [];
    
    while (it.hasNext()) {
      result.push(it.next().title);
    }
    
    expect(result).toEqual(['A', 'B']);
  });
});
