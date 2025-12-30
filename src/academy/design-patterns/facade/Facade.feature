Feature: Facade Pattern
  As a developer
  I want a simple interface for complex subsystems
  So that I can use the system without knowing all internal details

  Scenario: Starting Computer
    Given a ComputerFacade
    When I start the computer
    Then I should see "Loading RAM..."
    And I should see "Reading Disk..."
