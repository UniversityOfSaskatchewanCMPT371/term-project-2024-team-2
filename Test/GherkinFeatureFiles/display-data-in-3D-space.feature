Feature: Integrate Showing the data in 3D space

    Create an integration between data storage and displaying it in the 3D space.
    Only focus on continuous, real-value, or ordinal data (integers and floats)
    on a linear axis. Start with just the first 3 columns and the axis labels.

    Background:
        Given the user has Oculus Quest 2
        And the user has loaded the Quest Browser
        And the user has loaded the WebXR application
        And the user has entered VR mode

    @manualtesting
    Scenario: Multiple Access Data is visible
        Given the user has loaded data with 3-D data points
        When the user clicks on a data point
        Then the data should be displayed to the user

    @manualtesting
    Scenario: No data to be show
        Given the user has loaded no data
        When the user views the stage
        Then there should be no visible data

    @manualtesting
    Scenario: Loading data for floats
        Given that the user has loaded floating point values
        When the user selects the data point
        Then the data point should be at the correct co-ordinates
