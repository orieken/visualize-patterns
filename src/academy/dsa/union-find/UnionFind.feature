Feature: Union Find
  As a developer
  I want to track disjoint sets
  So that I can determine connectivity efficiently

  Scenario: Basic Connectivty
    Given a UnionFind of size 10
    When I union 0 and 1
    And I union 1 and 2
    Then 0 and 2 should be connected
    But 0 and 3 should not be connected
