Feature: K-Means Challenge
  Implement Clustering

  Scenario: 1D Clustering
    Given 1D points 0 and 10
    When I run Challenge K-Means k=2
    Then 1 should be in cluster 0
    And 9 should be in cluster 1
