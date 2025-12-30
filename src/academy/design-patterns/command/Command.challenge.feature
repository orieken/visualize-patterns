Feature: Command Challenge
  Implement Copy/Paste Undo

  Scenario: Undo Paste
    Given the editor has text "Hello"
    And I copy "Hello"
    When I paste
    Then the text should be "HelloHello"
    When I undo paste
    Then the text should be "Hello"
