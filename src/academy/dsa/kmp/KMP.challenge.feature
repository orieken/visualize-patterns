Feature: KMP Challenge
  Implement it!

  Scenario: User KMP
    Given a KMP text "HELLO WORLD HELLO"
    And a KMP pattern "HELLO"
    When I run Challenge KMP
    Then the Challenge matches should be at indices "0, 12"
