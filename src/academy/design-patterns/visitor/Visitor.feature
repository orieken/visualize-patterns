Feature: Visitor Pattern
  As a developer
  I want to separate algorithms from objects
  So that I can add new operations without changing classes

  Scenario: Exporting Shapes
    Given a Dot shape
    When I export it to XML
    Then the result should be "<dot>"
