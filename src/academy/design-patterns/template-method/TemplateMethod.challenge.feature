Feature: Template Method Challenge
  Implement Hot Drinks

  Scenario: Making Tea
    Given a TeaMaker
    When I prepare the recipe
    Then the steps should include "Steep tea bag"
