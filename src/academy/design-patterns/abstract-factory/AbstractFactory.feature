Feature: Abstract Factory
  As a furniture shop owner
  I want to create families of related products (Chair, Sofa)
  So that they match stilistically (Modern vs Victorian)

  Scenario: Creating a Modern Room
    Given a "ModernFactory"
    When I create a chair
    Then the chair should be "Modern"

  Scenario: Creating a Victorian Room
    Given a "VictorianFactory"
    When I create a sofa
    Then the sofa should be "Victorian"
