Feature: Depth-First Search
  As an algorithm student
  I want to visit graph nodes by diving as deep as possible
  So that I can explore paths fully before backtracking

  Scenario: Standard DFS Traversal
    Given a DFS graph structure:
      | node | neighbors |
      | A    | B, C      |
      | B    | D, E      |
      | C    | F         |
      | D    |           |
      | E    |           |
      | F    |           |
    When I run the Reference DFS starting from "A"
    Then the DFS visited order should be "A, B, D, E, C, F"
