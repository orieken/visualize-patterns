Feature: KNN
  As a data scientist
  I want to classify data based on similarity
  So that I don't need a training phase

  Scenario: Nearest Neighbors
    Given knowledge base x=[1,2,10,11] y=[0,0,1,1]
    When I query predict x=3 with k=3
    Then the result should be class 0
