Feature: Proxy Challenge
  Implement Internet Filter

  Scenario: Allowed Site
    Given a ProxyInternet
    When I connect to "google.com"
    Then it should connect

  Scenario: Banned Site
    Given a ProxyInternet
    When I connect to "banned.com"
    Then the connection should be denied
