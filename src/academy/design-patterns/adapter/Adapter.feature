Feature: Adapter Pattern
  As a developer
  I want to integrate incompatible interfaces
  So that I can use legacy code with modern clients

  Scenario: Standard Adaptation
    Given an Adaptee with reversed text
    When I use the Adapter
    Then the result should be readable text "Special behavior of the Adaptee"
