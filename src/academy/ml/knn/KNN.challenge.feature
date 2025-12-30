Feature: KNN Challenge
  Implement Neighbor Search

  Scenario: One Neighbor
    Given a minimal knowledge base x=[1, 10] y=[0, 1]
    When I predict x=2 with k=1
    Then the KNN-class should be 0
