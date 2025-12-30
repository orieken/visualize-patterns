Feature: Iterator Pattern
  As a developer
  I want to traverse elements of a collection
  So that I don't expose its underlying representation

  Scenario: Iterate Books
    Given a Bookshelf with "Moby Dick" and "Gatsby"
    When I iterate through the shelf
    Then I should retrieve "Moby Dick" then "Gatsby"
