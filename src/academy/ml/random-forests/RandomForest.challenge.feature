Feature: Random Forest Challenge
  Implement Voting

  Scenario: Majority Rules
    Given a challenge forest
    When I predict input 8
    Then the result is 1
