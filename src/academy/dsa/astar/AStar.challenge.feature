Feature: A* Challenge
  Implement A* yourself!

  Scenario: User implements A*
    Given a grid map with nodes:
      | id | x | y |
      | 1  | 0 | 0 |
      | 2  | 5 | 0 |
      | 3  | 10| 0 |
    And edges with weights:
      | from | to | weight |
      | 1    | 2  | 5      |
      | 2    | 3  | 5      |
    When I run Challenge A* from "1" to "3"
    Then the path should be "1, 2, 3"
