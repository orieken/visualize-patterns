Feature: Composite Pattern
  As a developer
  I want to treat individual objects and compositions uniformly
  So that I can build complex tree structures easily

  Scenario: Tree Operation
    Given a Composite Tree
    And I add a Leaf to it
    When I request operation
    Then the result should be "Branch(Leaf)"
