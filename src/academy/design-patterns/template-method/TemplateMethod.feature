Feature: Template Method Pattern
  As a developer
  I want to define the skeleton of an algorithm in a superclass
  So that subclasses can override specific steps without changing the structure

  Scenario: Data Mining
    Given a PDFMiner
    When I mine "report.pdf"
    Then the result should contain "PDF-content"
