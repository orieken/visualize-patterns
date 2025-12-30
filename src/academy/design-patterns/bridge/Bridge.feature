Feature: Bridge Pattern
  As a developer
  I want to decouple abstraction from implementation
  So that they can vary independently

  Scenario: TV Remote
    Given a TV device
    And I have a RemoteControl paired with it
    When I toggle power on the remote
    Then the TV should be enabled
