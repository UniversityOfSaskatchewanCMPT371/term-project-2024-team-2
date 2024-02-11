Feature: Data Point Component in WebXR Application
  Background:
    Given the WebXR application is loaded

  Scenario: View Data Points in 3D Space
    Then the data points should be rendered in 3D space

  Scenario: View Data Points in 3D Space while walking
    Then the data points should be rendered in 3D space
    When user walks around the data points
    Then the data points should be visible from all angles

  Scenario: Touch Data Points in 3D Space with left controller
    Then the data points should be rendered in 3D space
    When user hover the left controller on a data point
    Then the data point should be highlighted

  Scenario: Touch with Data Points in 3D Space with right controller
    Then the data points should be rendered in 3D space
    When user hover the right controller on a data point
    Then the data point should be highlighted

  Scenario: Choose Data Points in 3D Space with left controller
    Then the data points should be rendered in 3D space
    When user selects a data point with the left controller
    Then the data point should be highlighted
    And the data point's information should be displayed

  Scenario: Choose Data Points in 3D Space with right controller
    Then the data points should be rendered in 3D space
    When user selects a data point with the right controller
    Then the data point should be highlighted
    And the data point's information should be displayed

  Scenario: View Selected Data Point in 3D Space while walking
    Given a data point is selected
    When user walks around the data point
    Then the data point should be visible from all angles
    And the data point's information should be displayed from all angles

