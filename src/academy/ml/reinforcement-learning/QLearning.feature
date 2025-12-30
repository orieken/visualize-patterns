Feature: Q-Learning
  As an AI agent
  I want to learn from rewards
  So that I can maximize long-term utility

  Scenario: Propagation of Reward
    Given a linear path 0 -> 1 -> 2(Goal)
    When I train the agent
    Then the value of state 0 should increase towards Goal
