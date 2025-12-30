Feature: Builder Pattern
  As a library user
  I want to construct complex objects step by step
  So that I don't need giant constructors with nulls

  Scenario: Building a Minimal Product
    Given a Director with a ConcreteBuilder
    When I ask for a minimal viable product
    Then the product should have parts "PartA1"

  Scenario: Building a Full Product
    Given a Director with a ConcreteBuilder
    When I ask for a full featured product
    Then the product should have parts "PartA1, PartB1, PartC1"
