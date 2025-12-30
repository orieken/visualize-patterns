Feature: Decorator Pattern
  As a developer
  I want to attach new behaviors to objects dynamically
  So that I avoid subclass explosion

  Scenario: Wrapping Components
    Given a simple component "Base"
    When I decorate it with "A"
    And I decorate it again with "B"
    Then the result should be "B(A(Base))"
