Feature: Union Find Challenge
  Implement DSU!

  Scenario: User connections
    Given a Challenge UnionFind of size 5
    When I challenge-union 1 and 2
    Then 1 and 2 should be challenge-connected
