Feature: Logistic Regression
  As a data scientist
  I want to classify binary outcomes
  So that I can predict yes/no events

  Scenario: Binary Classification
    Given training data x=[1,2,8,9] and labels y=[0,0,1,1]
    When I train the logistic model
    Then predicting x=1.5 should be class 0
    And predicting x=8.5 should be class 1
