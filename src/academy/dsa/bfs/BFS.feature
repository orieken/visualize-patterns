Feature: Breadth-First Search
  As an algorithm student
  I want to visit graph nodes layer by layer
  So that I can find the shortest path in unweighted graphs

  Scenario: Standard BFS Traversal
    Given a graph structure:
      | node | neighbors |
      | A    | B, C      |
      | B    | D, E      |
      | C    | F         |
      | D    |           |
      | E    |           |
      | F    |           |
    When I run the Reference BFS starting from "A"
    Then the visited order should be "A, B, C, D, E, F"
