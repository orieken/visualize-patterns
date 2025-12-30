Feature: Command Pattern
  As a developer
  I want to encapsulate actions as objects
  So that I can parameterize calls and queue requests

  Scenario: Remote Control Light
    Given a Light is off
    When I execute the TurnOnCommand
    Then the Light should be on
