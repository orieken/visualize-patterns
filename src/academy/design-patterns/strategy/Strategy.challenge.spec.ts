import { describe, it, expect } from 'vitest';
import { ShoppingCart, CreditCardStrategy, PaypalStrategy } from './StrategyChallenge';

describe('Strategy Challenge', () => {
  it('should process payments', () => {
    let cart = new ShoppingCart(new CreditCardStrategy());
    expect(cart.checkout(100)).toContain('Credit Card');
    
    cart = new ShoppingCart(new PaypalStrategy());
    expect(cart.checkout(50)).toContain('PayPal');
  });
});
