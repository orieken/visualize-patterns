Feature: Study catalog highlights
  Scenario: Highlight the most common learning themes
    Given the curated collections of algorithms and patterns
    When I summarize the learning themes
    Then I see a breakdown that includes traversal, creation, and supervised learning
