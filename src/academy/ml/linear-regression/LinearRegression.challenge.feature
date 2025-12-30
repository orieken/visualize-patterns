Feature: Linear Regression Challenge
  Implement ML Training

  Scenario: Identity Function
    Given training data x=[1,2,3] and y=[1,2,3]
    When I train the challenge model
    Then predicting x=5 should be 5
