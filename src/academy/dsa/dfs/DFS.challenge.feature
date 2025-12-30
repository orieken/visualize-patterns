Feature: DFS Challenge
  Implement DFS yourself!

  Scenario: User implements DFS
    Given a DFS graph structure:
      | node | neighbors |
      | 1    | 2, 5      |
      | 2    | 3, 4      |
      | 3    |           |
      | 4    |           |
      | 5    |           |
    When I run the Challenge DFS starting from "1"
    Then the DFS visited order should be "1, 2, 3, 4, 5"
