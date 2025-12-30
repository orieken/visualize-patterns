Feature: Visitor Challenge
  Implement Discounts

  Scenario: Discounting Items
    Given a Book costing 100
    When I apply the Discount Visitor
    Then the new cost should be 90
