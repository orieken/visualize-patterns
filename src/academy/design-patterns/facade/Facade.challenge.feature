Feature: Facade Challenge
  Implement Video Converter

  Scenario: Convert Video
    Given a ConverterFacade
    When I convert "my.mov" to "ogg"
    Then the status should be "Converting my.mov to ogg"
