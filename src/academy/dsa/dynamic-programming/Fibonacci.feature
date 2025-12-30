Feature: Dynamic Programming (Fibonacci)
  As a math enthusiast
  I want to calculate Fibonacci numbers without recursion depth issues
  So that I can find the Nth number efficiently

  Scenario: Calculating Fib
    Given N is 6
    When I run Reference Fibonacci
    Then the result should be 8
