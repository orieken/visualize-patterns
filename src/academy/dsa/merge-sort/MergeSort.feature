Feature: Merge Sort
  As a student
  I want to sort arrays efficiently
  So that I can handle data in O(n log n) time

  Scenario: Sorting Numbers
    Given an unsorted array "5,3,8,4,2"
    When I run Reference Merge Sort
    Then the result array should be "2,3,4,5,8"
