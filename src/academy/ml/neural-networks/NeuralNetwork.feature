Feature: Neural Networks
  As a data scientist
  I want to model complex functions
  So that I can solve non-linear problems

  Scenario: Learning OR function
    Given training data for OR gate
    When I train the perceptron
    Then it should output near 0 for [0,0]
    And it should output near 1 for [1,0]
