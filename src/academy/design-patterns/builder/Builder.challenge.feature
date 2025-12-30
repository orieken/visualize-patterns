Feature: Builder Challenge
  Implement a Car Builder

  Scenario: Building a Sports Car
    Given a CarBuilder
    When I build a car with 2 seats, "V8" engine, and GPS
    Then the car description should be "Car with 2 seats, V8, GPS: true"
