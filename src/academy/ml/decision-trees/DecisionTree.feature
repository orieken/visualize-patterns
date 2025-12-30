Feature: Decision Tree
  As a data scientist
  I want to use a tree structure for decisions
  So that the rules are interpretable

  Scenario: Simple split
    Given a decision tree with rule "x < 5"
    When I predict inputs below 5
    Then result is class 0
    When I predict inputs above 5
    Then result is class 1
