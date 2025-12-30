Feature: Topological Sort
  As a scheduler
  I want to order tasks based on dependencies
  So that prerequisites are always met

  Scenario: Task Scheduling
    Given a dependency graph:
      | task | dependsOn |
      | Build | Lint     |
      | Lint  | Install  |
      | Test  | Build    |
      | Install |        |
    When I run Reference TopoSort
    Then "Install" should come before "Lint"
    And "Lint" should come before "Build"
    And "Build" should come before "Test"
