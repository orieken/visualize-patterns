Feature: Singleton Pattern

  In software engineering, the singleton pattern is a software design pattern 
  that restricts the instantiation of a class to one "single" instance.

  Scenario: Retrieving the singleton instance
    Given the Singleton class exists
    When I call the static getInstance method twice
    Then the two returned instances should be physically identical
