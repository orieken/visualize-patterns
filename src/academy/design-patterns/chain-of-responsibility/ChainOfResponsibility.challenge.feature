Feature: Chain of Responsibility Challenge
  Implement Support Ticket System

  Scenario: Escalation
    Given a support chain Level1 -> Level2 -> Manager
    When I submit a "critical" ticket
    Then it should be handled by "Manager"
