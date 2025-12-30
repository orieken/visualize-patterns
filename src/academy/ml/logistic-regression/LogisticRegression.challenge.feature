Feature: Logistic Regression Challenge
  Implement Sigmoid Prediction

  Scenario: Classifying Values
    Given a LogisticChallenge model with fixed weights
    When I predict for input 2
    Then the Logistic-class should be 0
    When I predict for input 6
    Then the Logistic-class should be 1
