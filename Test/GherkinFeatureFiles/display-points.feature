Feature: Data Point Component in WebXR Application
  Background:
    Given That the user is on the Meta Quest 2

  Scenario: View Data Points in 3D Space
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space

  Scenario: View Data Points in 3D Space while walking
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user walks around the data points
    Then the data points should be visible from all angles

  Scenario: Interact with Data Points in 3D Space
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user hover joy-stick on a data point
    Then the data point should be highlighted

  Scenario: Touch Data Points in 3D Space with left controller
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user hover the left controller on a data point
    Then the data point should be highlighted

  Scenario: Touch with Data Points in 3D Space with right controller
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user hover the right controller on a data point
    Then the data point should be highlighted

  Scenario: Choose Data Points in 3D Space with left controller
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user selects a data point with the left controller
    Then the data point should be highlighted
    And the data point's information should be displayed

  Scenario: Choose Data Points in 3D Space with right controller
    When the WebXR application is loaded
    Then the data points should be rendered in 3D space
    When user selects a data point with the right controller
    Then the data point should be highlighted
    And the data point's information should be displayed

