Feature: Composite Challenge
  Implement CompoundGraphic

  Scenario: Grouping Dots
    Given a CompoundGraphic group
    And I add a Dot to the group
    When I draw the group
    Then the output should contain "Dot"
