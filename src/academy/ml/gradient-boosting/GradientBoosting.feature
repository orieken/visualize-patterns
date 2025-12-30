Feature: Gradient Boosting
  As a data scientist
  I want to combine weak learners
  So that I can model complex patterns accurately

  Scenario: Reducing Residuals
    Given a target value of 10
    When I train boosting for 50 iterations
    Then the prediction should be close to 10
