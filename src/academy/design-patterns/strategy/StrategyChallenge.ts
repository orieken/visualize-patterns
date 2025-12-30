export interface PaymentStrategy {
  pay(amount: number): string;
}

/**
 * CHALLENGE: Implement CreditCardStrategy and PaypalStrategy.
 */
export class CreditCardStrategy implements PaymentStrategy {
  pay(amount: number): string {
    // TODO: Return "Paid $X via Credit Card"
    return ""; // <-- FIX THIS
  }
}

export class PaypalStrategy implements PaymentStrategy {
  pay(amount: number): string {
    // TODO: Return "Paid $X via PayPal"
    return ""; // <-- FIX THIS
  }
}

export class ShoppingCart {
  constructor(private strategy: PaymentStrategy) {}
  
  checkout(amount: number) {
    return this.strategy.pay(amount);
  }
}
