Feature: BFS Challenge
  Implement BFS yourself!

  Scenario: User implements BFS
    Given a graph structure:
      | node | neighbors |
      | 1    | 2, 3      |
      | 2    | 4         |
      | 3    | 5         |
      | 4    |           |
      | 5    |           |
    When I run the Challenge BFS starting from "1"
    Then the visited order should be "1, 2, 3, 4, 5"
