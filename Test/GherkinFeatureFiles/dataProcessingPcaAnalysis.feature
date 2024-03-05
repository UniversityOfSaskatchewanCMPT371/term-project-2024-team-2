Feature: Data processing backend of the PCA analysis

  Scenario: Passing the right amount of data to be processed
    Given the user has provided a dataset with sufficient data points
    When the user utilizes of the PCA analysis
    Then the system should calculate the PCAs
    And  the system should display at least 3 PCAs

  Scenario: Handling incorrect amount of data passed in for PCA analysis
    Given the user has provided a dataset with insufficient data points
    When the user utilizes of the PCA analysis
    Then the system should return an error message indicating insufficient data
    And the system should not calculate any PCAs