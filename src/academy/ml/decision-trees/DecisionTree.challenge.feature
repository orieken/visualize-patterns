Feature: Decision Tree Challenge
  Implement Tree Traversal

  Scenario: Tree Walk
    Given a challenge tree split at 10
    When I DT-predict 5
    Then the DT-class is 0
    When I DT-predict 15
    Then the DT-class is 1
