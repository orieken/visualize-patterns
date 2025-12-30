Feature: Observer Pattern
  As a developer
  I want to define a subscription mechanism
  So that multiple objects get notified about events

  Scenario: News Broadcast
    Given a NewsAgency
    And a channel "CNN" subscribed to it
    When the agency broadcasts "Election Results"
    Then "CNN" should have the latest news "Election Results"
