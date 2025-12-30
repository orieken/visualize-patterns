Feature: Q-Learning Challenge
  Implement Bellman Update

  Scenario: Single Update
    Given an initialized Q-Agent
    When I perform a learning step with reward 10
    Then the Q-value should be non-zero
