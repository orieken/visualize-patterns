Feature: Proxy Pattern
  As a developer
  I want to control access to an object
  So that I can add security, logging, or lazy loading

  Scenario: Secure Access
    Given a RealSubject
    And a Proxy guarding it
    When I request through Proxy
    Then the request should be allowed and logged
