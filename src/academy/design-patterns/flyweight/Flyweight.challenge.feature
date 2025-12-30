Feature: Flyweight Challenge
  Implement Text Flyweight

  Scenario: Shared Characters
    Given I get character "A" with font "Arial"
    And I get character "A" with font "Arial" again
    Then they should be the exact same object
