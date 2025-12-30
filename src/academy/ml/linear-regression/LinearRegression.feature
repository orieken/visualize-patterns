Feature: Linear Regression
  As a data scientist
  I want to predict continuous values
  So that I can model trends

  Scenario: Simple Linear Fit
    Given training data x=[1,2,3], y=[3,5,7]
    When I train the model
    Then predicting x=4 should give 9
