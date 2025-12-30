Feature: Dijkstra Challenge
  Implement Dijkstra yourself!

  Scenario: User implements Dijkstra
    Given a weighted graph:
      | from | to | weight |
      | 1    | 2  | 5      |
      | 1    | 3  | 10     |
      | 2    | 3  | 2      |
      | 3    |    |        |
    When I run Challenge Dijkstra from "1"
    Then the distance to "3" should be 7
    # 1->2 (5) + 2->3 (2) = 7. Direct is 10.
