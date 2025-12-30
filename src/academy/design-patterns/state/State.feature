Feature: State Pattern
  As a developer
  I want objects to alter behavior when internal state changes
  So that I avoid massive switch statements

  Scenario: Document Publishing
    Given a Draft Document
    When I publish it
    Then the status should take effect as "Published Mode"
