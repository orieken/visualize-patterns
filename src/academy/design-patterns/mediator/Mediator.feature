Feature: Mediator Pattern
  As a developer
  I want to centralize complex communications
  So that components don't refer to each other explicitly

  Scenario: Chat Room
    Given users Alice and Bob are in a ChatRoom
    When Alice sends "Hi"
    Then Bob should receive "Hi"
