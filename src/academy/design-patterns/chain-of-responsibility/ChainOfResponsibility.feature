Feature: Chain of Responsibility
  As a developer
  I want to pass requests along a chain of handlers
  So that multiple objects have a chance to process the request without coupling sender to receiver

  Scenario: Animal Feeding Chain
    Given a chain Monkey -> Squirrel -> Dog
    When I feed "Nut" to the Monkey
    Then the "Squirrel" should eat it
    When I feed "Coffee" to the Monkey
    Then no one should eat it
