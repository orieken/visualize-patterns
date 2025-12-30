Feature: Prototype Challenge
  Implement standard cloning

  Scenario: User clones a Sheep
    Given a sheep named "Dolly"
    When I verify the clone
    Then the clone should be a separate object with name "Dolly"
