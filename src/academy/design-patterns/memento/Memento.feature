Feature: Memento Pattern
  As a developer
  I want to capture object state
  So that I can restore it later without violating encapsulation

  Scenario: Text Editor Undo
    Given an Editor with text "Version 1"
    When I save state
    And I type " Version 2"
    And I restore state
    Then the text should be "Version 1"
