Feature: Bridge Challenge
  Implement Shape Bridge

  Scenario: Vector Circle
    Given a VectorRenderer
    And a Circle of radius 5
    When I draw the circle
    Then the output should be "Drawing a circle of radius 5 lines"
