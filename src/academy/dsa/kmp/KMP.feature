Feature: Knuth-Morris-Pratt
  As a text editor dev
  I want to search strings efficiently
  So that I avoid O(N*M) worst cases

  Scenario: String Search
    Given a text "ABABAB"
    And a pattern "ABAB"
    When I run Reference KMP
    Then the matches should be at indices "0, 2"
