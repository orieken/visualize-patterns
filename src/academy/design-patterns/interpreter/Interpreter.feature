Feature: Interpreter Pattern
  As a developer
  I want to evaluate sentences in a language
  So that I can process domain-specific rules

  Scenario: Boolean Logic
    Given variables x=true, y=false
    And an expression "x AND y"
    When I interpret the expression
    Then the result should be false
