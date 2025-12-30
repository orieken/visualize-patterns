Feature: Dijkstra's Algorithm
  As an algorithm student
  I want to find the shortest path in a weighted graph
  So that I can optimize routes (like GPS navigation)

  Scenario: Shortest Path Calculation
    Given a weighted graph:
      | from | to | weight |
      | A    | B  | 1      |
      | A    | C  | 4      |
      | B    | C  | 2      |
      | B    | D  | 5      |
      | C    | D  | 1      |
      | D    |    |        |
    When I run Reference Dijkstra from "A"
    Then the distance to "D" should be 4
    And the distance to "C" should be 3
