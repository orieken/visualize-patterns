Feature: Memento Challenge
  Implement Game Save

  Scenario: Checkpoints
    Given a Game at Level 5 with 50 HP
    When I save the game
    And I play getting damaged to 40 HP
    And I load the save
    Then I should be back at Level 5 with 50 HP
