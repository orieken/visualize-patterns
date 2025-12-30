Feature: K-Means Clustering
  As a data scientist
  I want to group similar data points
  So that I can discover structure in unlabeled data

  Scenario: Separation
    Given a dataset of [0,0] and [10,10]
    When I cluster into 2 groups
    Then [0.5,0.5] should belong to the first cluster
    And [10.5,10.5] should belong to the second cluster
