Feature: Prototype Pattern
  As a developer
  I want to clone existing objects
  So that I can create new instances efficiently and independently

  Scenario: Cloning a Robot
    Given an original robot "C-3PO" with directive "Translate"
    When I clone the robot
    And I add "Walk" directive to the clone
    Then the original robot should still calculate only "Translate"
    And the clone should calculate "Translate, Walk"
