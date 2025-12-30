Feature: Strategy Challenge
  Implement Payment Strategies

  Scenario: Paying
    Given a Cart with PayPal Strategy
    When I checkout 50
    Then the payment should indicate "PayPal"
