Feature: Interpreter Challenge
  Implement Math

  Scenario: Basic Math
    Given the math expression "5 plus 10"
    When I interpret the math
    Then the math result should be 15
