Feature: SVM Challenge
  Implement Margin Prediction

  Scenario: Hyperplane
    Given an SVM with weights [1] and bias 0
    When I SVM-predict 5
    Then the SVM-class is 1
    When I SVM-predict -5
    Then the SVM-class is -1
