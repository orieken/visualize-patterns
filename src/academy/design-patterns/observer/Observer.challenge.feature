Feature: Observer Challenge
  Implement Weather Station

  Scenario: Temperature Update
    Given a WeatherStation
    And a PhoneDisplay subscribed
    When the temperature changes to 30
    Then the info on PhoneDisplay should update to 30
