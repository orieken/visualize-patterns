Feature: Quick Sort
  As a student
  I want to partition and sort arrays
  So that I can implement one of the fastest general-purpose sorts

  Scenario: Sorting
    Given a list of numbers "10, 5, 2, 3"
    When I run Reference QuickSort
    Then the sorted list should be "2, 3, 5, 10"
