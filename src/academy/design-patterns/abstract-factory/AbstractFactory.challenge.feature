Feature: Abstract Factory Challenge

  Scenario: Windows Application
    Given I configure the app with "WinFactory"
    When the app paints
    Then the result should be "WinButton"

  Scenario: Mac Application
    Given I configure the app with "MacFactory"
    When the app paints
    Then the result should be "MacButton"
