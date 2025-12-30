Feature: PCA Challenge
  Implement Projection

  Scenario: Reducing Dimensions
    Given 2D data that is diagonal
    When I challenge-PCA to 1D
    Then I should get a 1D result
