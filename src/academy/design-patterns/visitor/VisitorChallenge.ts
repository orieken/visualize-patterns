export interface ShoppingVisitor {
  visitBook(b: Book): number;
  visitFood(f: Food): number;
}

export interface Item {
  accept(v: ShoppingVisitor): number;
  price: number;
}

export class Book implements Item {
  constructor(public price: number) {}
  accept(v: ShoppingVisitor) { return v.visitBook(this); }
}

export class Food implements Item {
  constructor(public price: number) {}
  accept(v: ShoppingVisitor) { return v.visitFood(this); }
}

/**
 * CHALLENGE: Implement DiscountVisitor.
 * - Books get 10% off (price * 0.9)
 * - Food gets 20% off (price * 0.8)
 */
export class DiscountVisitor implements ShoppingVisitor {
  visitBook(b: Book): number {
    return b.price; // <-- FIX THIS
  }
  
  visitFood(f: Food): number {
    return f.price; // <-- FIX THIS
  }
}
