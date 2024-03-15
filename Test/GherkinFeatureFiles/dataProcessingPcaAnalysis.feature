Feature: Data processing backend of the PCA analysis

  Write and run the integration tests for the data processing backend of the PCA analysis. 
  A principal component analysis (PCA) plot shows similarities between groups of samples in a data set

  Background:
    Given the user has Oculus Quest 2
    And the user has loaded the Quest Browser
    And the user has loaded the WebXR application
    And the user has entered VR mode

  Scenario: Passing the right amount of data to be processed
    Given the user has provided a dataset with sufficient data points
    When the user utilizes the PCA analysis
    Then the system should calculate the PCAs
    And  the system should display at least 3 PCAs

  Scenario: Handling incorrect amount of data passed in for PCA analysis
    Given the user has provided a dataset with insufficient data points
    When the user utilizes the PCA analysis
    Then the system should return an error message indicating insufficient data
    And the system should not calculate any PCAs

