Feature: PCA
  As a data scientist
  I want to reduce dimensionality
  So that I can visualize high-dim data

  Scenario: Line Projection
    Given data points [1,1], [2,2], [3,3]
    When I apply PCA to 1 component
    Then the projected values should preserve the order
