Feature: UI Interaction for Point Details

  This feature verifies the interaction with a data point on the graph will display detail of the point

  Background:
    Given the user has Oculus Quest 2
    And the user has loaded the Quest Browser
    And the user has loaded the WebXR application
    And the user has loaded a csv
    And the data points are being displayed on the graph

  @manualtesting
  Scenario Outline: Clicking a data point on the graph
    Given data points show on the graph from the csv
    When the user selects a single data point
    Then details of that point should appear <datapoint1> <Name1> <Province1> <Country1>

    Examples:
      | datapoint1 | Name1    | Province1 | Country1 |
      | p1         | John Doe | Alberta   | Canada   |

  @manualtesting
  Scenario Outline: Clicking a second data point on the graph
    Given the user has their first <datapoint1> selected
    When the user selects a secondary <datapoint2>
    Then details of that <datapoint1> should disappear <datapoint1> <Name1> <Province1> <Country1>
    And the details of <datapoint2> should appear <datapoint2> <Name2> <Province2> <Country2>

    Examples:
      | datapoint1 | Name1    | Province1 | Country1 |
      | p1         | John Doe | Alberta   | Canada   |

    Examples:
      | datapoint2 | Name2             | Province2        | Country2      |
      | p2         | Mary Jane         | Saskatchewan     | Canada        |
      | p3         | George Black      | British Columbia | Canada        |
      | p4         | Sarah Mcgoon      | Yukon            | Canada        |
      | p5         | Minnnie Claypoole | Texas            | United States |

  @manualtesting
  Scenario: Clicking the same data point
    Given the user has a data point selected
    And that data points details are displayed
    When the user selects the same data point
    Then details of that point should disappear

  @manualtesting
  Scenario: user moves around while a data point is selected
    Given the user has a data point selected
    When the user walks around
    Then details of that point should stay where they are
    And should always face the user