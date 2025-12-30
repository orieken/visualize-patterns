Feature: Adapter Challenge
  Implement a Temp Adapter

  Scenario: Converting Temp
    Given a Fahrenheit Sensor reading 100
    When I read from the Adapter
    Then the Celsius value should be approx 37.7
