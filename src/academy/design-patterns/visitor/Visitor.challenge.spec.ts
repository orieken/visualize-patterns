import { describe, it, expect } from 'vitest';
import { Book, Food, DiscountVisitor } from './VisitorChallenge';

describe('Visitor Challenge', () => {
  it('should calculate discounts', () => {
    const book = new Book(100);
    const food = new Food(100);
    const visitor = new DiscountVisitor();
    
    expect(book.accept(visitor)).toBe(90); // 10% off
    expect(food.accept(visitor)).toBe(80); // 20% off
  });
});
