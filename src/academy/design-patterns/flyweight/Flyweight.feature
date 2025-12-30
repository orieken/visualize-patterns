Feature: Flyweight Pattern
  As a game dev
  I want to share common object data (Flyweights)
  So that I can render millions of objects in RAM

  Scenario: Sharing Tree Types
    Given I request a "Pine" type twice
    Then the two types should be the SAME object instance
