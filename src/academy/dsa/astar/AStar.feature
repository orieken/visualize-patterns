Feature: A* Search
  As a game developer
  I want to find the shortest path efficiently
  So that NPCs can navigate intelligently toward a target

  Scenario: Grid Navigation
    Given a grid map with nodes:
      | id | x | y |
      | S  | 0 | 0 |
      | A  | 1 | 0 |
      | B  | 0 | 1 |
      | G  | 1 | 1 |
    And edges with weights:
      | from | to | weight |
      | S    | A  | 1      |
      | S    | B  | 5      |
      | A    | G  | 2      |
      | B    | G  | 1      |
    When I run Reference A* from "S" to "G"
    Then the path should be "S, A, G"
    # S->A->G = 1+2=3. S->B->G = 5+1=6.
    # Note: Heuristics typically prioritize looking towards goal.
    # Dist(A,G)=1, Dist(B,G)=1. 
    # f(A) = g(1) + h(1) = 2.
    # f(B) = g(5) + h(1) = 6.
    # A is chosen first.
