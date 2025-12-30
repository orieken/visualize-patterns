Feature: Topological Sort Challenge
  Implement it!

  Scenario: Simple DAG
    Given a Challenge dependency graph:
      | task | dependsOn |
      | B    | A         |
      | A    |           |
    When I run Challenge TopoSort
    Then "A" should come before "B" in Challenge result
