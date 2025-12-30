Feature: Study catalog highlights

  Background:
    Given the curated collections of algorithms and patterns

  Scenario: Highlight the most common learning themes
    When I summarize the learning themes
    Then I see a breakdown that includes traversal, creation, and supervised learning
