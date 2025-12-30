Feature: Mediator Challenge
  Implement Air Traffic Control

  Scenario: Runway Collision Avoidance
    Given an AirportTower
    When Plane A requests to land
    Then permission should be GRANTED
    When Plane B requests to land immediately after
    Then permission should be DENIED
