Feature: Singleton Challenge

  Scenario: Implement a Singleton yourself
    Given I have a class "DatabaseConnection" that is not yet reduced to a Singleton
    When I obtain two instances via "getInstance"
    Then the system should verify they are the SAME instance
    # Hints:
    # 1. Use a private static property to store the instance.
    # 2. Check if it's null before creating a new one.
