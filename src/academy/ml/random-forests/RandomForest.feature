Feature: Random Forest
  As a data scientist
  I want to use multiple trees
  So that I reduce overfitting

  Scenario: Voting
    Given a forest with 3 trees
    When I predict input 3
    Then the majority vote should be 0
