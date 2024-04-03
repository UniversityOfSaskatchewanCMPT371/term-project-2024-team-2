Feature: Exclude Incomplete Data from a CSV

  CSVs with incomplete data (missing values) should these incomplete rows excluded from the
  processed data.

  Background:
    Given that the user is on a Meta Quest 2
    And they are inside the Quest Browser
    And they have loaded the web app
    And they have imported a CSV

  Scenario: The CSV is complete
    Given the user has imported a complete CSV with no missing values
    When the CSV has finished processing
    Then all the data from the CSV should be successfully imported

  Scenario Outline: The CSV is incomplete
    Given the user has imported an incomplete <CSV> with missing values
    When the <CSV> has finished processing
    Then all the <complete> rows from the <CSV> should be successfully imported
    And all <incomplete> rows should be discarded

    Examples:
      | CSV           |
      | exclusion.csv |

    Examples:
      | type       | x | y | z |
      | complete   | 1 | 2 | 3 |
      | incomplete | 1 |   | 3 |
      | complete   | 1 | 2 | 3 |
