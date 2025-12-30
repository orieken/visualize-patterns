Feature: Factory Method
  As a developer
  I want to delegate object creation to subclasses
  So that I can introduce new types without changing the main logic

  Scenario: Road Logistics produces Trucks
    Given a "RoadLogistics" creator
    When I ask it to plan delivery
    Then the result should contain "Delivering by land"

  Scenario: Sea Logistics produces Ships
    Given a "SeaLogistics" creator
    When I ask it to plan delivery
    Then the result should contain "Delivering by sea"
