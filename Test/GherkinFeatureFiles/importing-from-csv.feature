Feature: Importing From a CSV

  Importing to the web app from a CSV, to then use the data. This can come from an exterior url or a file import.

  Background:
    Given that the user is on a Meta Quest 2
    And they are inside of the quest browser
    And they have loaded the web app

  Scenario: CSV buttons become visible to the user
    Given the user is on the webapp landing page
    When the user clicks the Enter VR button
    Then the Load csv from file button should become visible
    And the Load csv from URL button should become visible

  Scenario Outline: Loading CSV from URL
    Given the user has the option to select a URL
    When the user enters <CSVUrl>
    And they press the Load VSC button
    Then CSV should load into the app

    Examples:
      | CSVUrl            |
      | I dont have a url |
      | 2ndURL            |

  Scenario Outline: Loading CSV from local files system
    Given that the user has the option to load from file system
    When they click the ChooseFile button
    And they select the <CSVFile> from their system
    Then it should load the content into the app

    Examples:
      | CSVFile    |
      | Grades.csv |

  Scenario Outline: Correct data is loaded from CSV
    Given that the user has loaded the <CSV>
    When the user clicks the print to console button
    Then the <Index> <Subject> <Course Number> <Grade> <Term Taken> should become visible

    Examples:
      | CSV        |
      | Grades.csv |

    Examples:
      | Index | Subject | Course Number | Grade | Term Taken        |
      | 0     | eng     | 111           | 64    | spring2021        |
      | 1     | phys    | 115           | 92    | spring2021        |
      | 2     | phys    | 117           | 93    | spring2021        |
      | 3     | math    | 110           | 99    | summer2021        |
      | 4     | math    | 164           | 86    | summer2021        |
      | 5     | art     | 110           | 93    | fall2021          |
      | 6     | cmpt    | 140           | 94    | fall2021          |
      | 7     | indg    | 107           | 77    | fall2021          |
      | 8     | phil    | 120           | 79    | fall2021          |
      | 9     | stat    | 245           | 93    | fall2021          |
      | 10    | astr    | 113           | 93    | winter2022        |
      | 11    | cmpt    | 141           | 93    | winter2022        |
      | 12    | comm    | 201           | 83    | winter2022        |
      | 13    | econ    | 111           | 76    | winter2022        |
      | 14    | math    | 116           | 100   | winter2022        |
      | 15    | cmpt    | 145           | 92    | spring/summer2022 |
      | 16    | mus     | 101           | 97    | summer2022        |
      | 17    | cmpt    | 214           | 83    | fall2022          |
      | 18    | cmpt    | 260           | 88    | fall2022          |
      | 19    | cmpt    | 270           | 96    | fall2022          |
      | 20    | math    | 225           | 82    | fall2022          |
      | 21    | math    | 226           | 87    | winter2023        |
      | 22    | cmpt    | 215           | 88    | winter2023        |
      | 23    | cmpt    | 280           | 83    | winter2023        |
      | 24    | cmpt    | 394           | 90    | winter2023        |
      | 25    | econ    | 211           | 91    | winter2023        |
      | 26    | cmpt    | 281           | 86    | fall2023          |
      | 27    | cmpt    | 332           | 71    | fall2023          |
      | 28    | cmpt    | 370           | 78    | fall2023          |
      | 29    | math    | 336           | 91    | fall2023          |

  Scenario: Pressing import button without CSV
    Given the user has not entered a CSV
    When they press the Load CSV button
    But they have not entered anything
    Then it should not load anything

  Scenario: Importing empty CSV
    Given the user has selected the emptyCSV.csv
    When they confirm this entry
    Then the app should notify them the file was empty

  Scenario: Selecting a new CSV after already selecting one
    Given the user has selected a csv
    And they have loaded the CSV
    When they click the Choose File butotn
    And they select a different CSV
    Then the new data should be loaded
    And the old data should be gone


