Feature: Factory Method Challenge

  Scenario: Windows Dialog
    Given I have a "WindowsDialog"
    When I render the window
    Then it should mention "Rendering Windows Button"

  Scenario: Web Dialog
    Given I have a "WebDialog"
    When I render the window
    Then it should mention "Rendering HTML Button"
