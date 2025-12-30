Feature: SVM
  As a data scientist
  I want to find the best hyperplane
  So that I maximize the margin between classes

  Scenario: Linear Separation
    Given training points -2,-1 class -1 and 1,2 class 1
    When I train SVM
    Then -5 should be class -1
    And 5 should be class 1
