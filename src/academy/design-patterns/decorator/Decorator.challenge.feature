Feature: Decorator Challenge
  Implement Encryption

  Scenario: Encrypted Writing
    Given a FileDataSource
    And an EncryptionDecorator around it
    When I write "secret"
    Then the output should NOT contain plain "secret"
