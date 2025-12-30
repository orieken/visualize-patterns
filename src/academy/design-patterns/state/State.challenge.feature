Feature: State Challenge
  Implement Traffic Light

  Scenario: Cycling Colors
    Given a Red TrafficLight
    When I change the light
    Then it becomes "Green"
    When I change the light again
    Then it becomes "Yellow"
