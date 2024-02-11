Feature: Create Axis for 3D Graph

  This feature verifies the creation and manipulation of 3D axes in WebXr application.

  Background:
    Given the user has Oculus Quest 2
    And the user has loaded the Quest Browser
    And the user has loaded the WebXR application

  @manualtesting
  Scenario: Displaying 3D axes upon application load
    Given the application is loaded on the Meta Quest 2
    When the 3D visualization system initializes
    Then a 3D axes should be generated
    And the 3D axes should be visible to the user

  @manualtesting
  Scenario: Moving along the X-axis
    Given I have a displayed 3D axes
    When I use the OculusControls to move along the X-axis
    Then the view should move along the X-axis

  @manualtesting
  Scenario: Moving along the Y-axis
    Given I have a displayed 3D axes
    When I use the OculusControls to move along the Y-axis
    Then the view should move along the Y-axis

  @manualtesting
  Scenario: Moving along the Z-axis
    Given I have a displayed 3D axes
    When I use the OculusControls to move along the Z-axis
    Then the view should move along the Z-axis

  @manualtesting
  Scenario: Checking the stability of the 3D axes
    Given I have a displayed 3D axes
    When I move along the X, Y, and Z axes
    Then the 3D axes should remain stable
    And there should be no noticeable lag
