Feature: Gradient Boosting Challenge
  Implement Sequential Learning

  Scenario: Summing Predictions
    Given a boosting model with 2 learners predicting 10
    When I predict with learning rate 0.1
    Then the total should be 2
