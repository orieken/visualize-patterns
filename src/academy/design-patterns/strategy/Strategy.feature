Feature: Strategy Pattern
  As a developer
  I want to define a family of algorithms
  So that I can switch them at runtime

  Scenario: Route Navigation
    Given a Navigator with RoadStrategy
    When I plan route from "Home" to "Work"
    Then the route should be via "Road"
