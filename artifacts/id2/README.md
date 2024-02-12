# Artifacts and Summary for ID2

## ID2 Summary
### Team Roles ID2
| Name                    	| Team 	|            Role 	|
|-------------------------	|-----:	|----------------:	|
| Matthew Buglass         	| N/A  	| Project Manager 	|
| Jesse Haug              	| Dev  	| Dev Lead        	|
| Joe Mbonayo             	| Dev  	|                 	|
| Zander Rommelaere       	| Dev  	| Build Master    	|
| Quinn Brown             	| Dev  	| Risk Officer    	|
| Mitchell Wagner         	| QA   	| Test Lead       	|
| Aesha Patel             	| QA   	| Risk Officer    	|
| Trang Nguyen            	| QA   	| Build Master    	|
| Long Quan (Tony) Nguyen 	| QA   	| Design Lead     	|

### Included PDF Documents
- [ID 1 Review, Retro, and Planning Minutes](./id1_retro_review_planning_minutes.pdf)
- [ID 1 Review, Retro, and Planning JamBoard](./id1_retro_jamboard.pdf)
- [Development Update](./id2_dev_team_update.pdf)
- [Testing Update](./id2_test_team_update.pdf)
- [Risk Analysis](./id2_risk_analysis.pdf)
- [Requirements Specification](./id2_requirements_specifications.pdf)
- [Code Style Report](./id2_code_template_report.pdf)
- [Integration Test Results](./id2_test_list.pdf)
- [Test Matrix](./id2_test_matrix.pdf)
- [Class Diagram](./id2_class_diagram.pdf)
- [Sequence Diagram](./id2_sequence_diagram.pdf)
- [Componenet Diagram](./id2_component_diagram.pdf)
- [Time Tracking and Activity Logs](./id2_activity_log.pdf)
    - Note Matthew's log refernces [this document](./id2_matthew_buglass_activity_log.pdf). Added to source control as the link in the activity log doesn't work.

### Knowledge Sharing and Pairing Sessions:
We have a group shared calendar to book meetings, standups, and pairing sessions.

#### PM Pairing Session
- Duration: 2.5hrs
- Attended by: Trang, Matthew
- Paried on tasks for backlog refinement, sprint planning and backlog grooming for ID2, and preparing the ID1 presentation.

#### Code Inspection: Tony
- Duration: 1hr
- Attended by: Tony, Jesse, Quinn, Matthew
- Inspected Tony's Logging configuration PR

#### Code Inspection: Mitchell
- Duration: 1hr
- Attended by: Tony, Jesse, Quinn, Aesha, Mitchell, Matthew
- Inspected Mitchell's fixes and configuiration to the Jest testing setup.

#### Gherkin Pairing
- Duration: 1hr
- Attended by: Trang, Mitchell
- Tuorial on current Gherkins and how to write new ones

#### CI/CD Syncup
- Duration: 0.5hrs
- Attended by: Trang, Zander
- Tuorial on current Gherkins and how to write new ones

#### CI/CD Pairing
- Duration: 0.5hrs
- Attended by: Trang, Tony
- Tuorial on current Gherkins and how to write new ones

#### Dev Team group Pairing
- Duration: 1hr
- Attended by: Quinn, Zander, Jesse
- Sync up on development progress and coordinating on merge conflicts

#### Dev Team Unit Test Pairing
- Duration: 3hrs
- Attended by: Quinn, Zander, Jesse
- Group pairing on testing style of React and ReactXR components

#### Architecture design
- Duration: 2hrs
- Attended by: Jesse, Matthew
- Pairing on designing the interaction diagrams and division of responsibility within the application

#### Code Inspection: Matthew
- Duration: 1hr
- Attended by: Mitchell, Jesse, Quinn, Matthew
- Inspected Matthew's Effective Code Review documentation

### Card and Work Summary
This sprint focussed on creating and testing hte discrere components and functionality assiciated with building the 3D graph. The core functionalities introduced, from a development perspective, were:
- 3D axes display
- Data point interaction and display; and 
- CSV loading from the filesystem and a url

On the Test and QA side, we introduced:
- Jest testing config
- Multi-level logging with file-system loggers to capture logs in production
- More Gherkins for integration testing

On the Build side, we introduced:
- a `.noai` file to prevent JetBrain's AI assitant from reading our code
- Auto deploying to staging and production Firebase instances
- Automatic regression testing for unit tests
- Security analysis
- Reduced unneccessary builds

|Title                                                                |URL                                                                                   |Assignees                                 |Status   |Labels                      |Linked pull requests                                                                                                                                                     |Estimate (hrs)|Actual (hrs)|
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------|------------------------------------------|---------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|------------|
|Design Component Diagram                                             |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/75 |LongQuanNguyen                            |Done     |design, ID2                 |                                                                                                                                                                         |2             |            |
|Integrate position sensing                                           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/14 |Jesster2829                               |Done     |ID2, Required               |                                                                                                                                                                         |1             |            |
|Creating Body For 3D Graph                                           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/80 |Jesster2829                               |Won't Do |ID2, Required               |                                                                                                                                                                         |5             |            |
|Gherkin for Importing form a csv                                     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/59 |MitchWag01                                |Done     |Gherkin, ID1, ID2, test     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/128                                                                                     |2             |            |
|Repository-wide .gitignore                                           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/63 |Subzeero                                  |Done     |enhancement, ID2            |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/70                                                                                      |1             |1           |
|Add `.noai` file to project                                          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/53 |Subzeero, trangnguyen3010                 |Done     |CI/CD, Required             |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/71                                                                                      |1             |1           |
|Update Versions of checkout & setup-node actions to lastest - v4     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/68 |Subzeero                                  |Done     |CI/CD, ID2                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/98                                                                                      |1             |1           |
|Create ESLint CI/CD                                                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/64 |Subzeero                                  |Blocked  |CI/CD, ID2                  |                                                                                                                                                                         |2             |            |
|Firebase Build step                                                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/67 |trangnguyen3010                           |Done     |CI/CD, ID2                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/99, https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/103|3             |            |
|Remove double builds on PR                                           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/69 |trangnguyen3010                           |Done     |CI/CD, ID2                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/81                                                                                      |1             |            |
|Write build step for unit tests                                      |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/66 |trangnguyen3010                           |Done     |CI/CD, ID2                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/82                                                                                      |2             |            |
|Design Interaction Diagram                                           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/72 |Jesster2829, matthew-buglass              |Done     |design, ID2                 |                                                                                                                                                                         |2             |4           |
|Configure logging                                                    |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/73 |LongQuanNguyen                            |Done     |ID2                         |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/85                                                                                      |2             |            |
|Artifact Inspection: Tony                                            |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/86 |LongQuanNguyen                            |Done     |ID2, inspection             |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/85                                                                                      |1             |            |
|Parse CSV file from a URL                                            |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/11 |LongQuanNguyen                            |Done     |ID2, Required               |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/44, https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/112|1             |            |
|Parse CSV file from File Systems                                     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/10 |LongQuanNguyen                            |Done     |ID2, Required               |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/44, https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/113|1             |            |
|Create build artifacts (e.g. build logs, test outputs,...)           |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/74 |trangnguyen3010                           |Todo     |CI/CD, ID2                  |                                                                                                                                                                         |1             |            |
|Create build step for security analysis                              |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/65 |trangnguyen3010                           |Done     |CI/CD, ID2                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/84                                                                                      |1             |            |
|Implement the CSV import button in both VR space and before VR space |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/76 |                                          |Won't Do |ID2                         |                                                                                                                                                                         |              |            |
|Create Axis for 3D graph                                             |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/78 |qpb948                                    |Done     |ID2, Required               |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/111                                                                                     |5             |15          |
|Creating Data Points For 3D Graph                                    |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/79 |Subzeero                                  |Done     |ID2, Required               |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/106                                                                                     |5             |10          |
|Make Inspection Template and Schedule                                |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/83 |matthew-buglass                           |Done     |documentation, ID2, Required|                                                                                                                                                                         |1             |1           |
|Artifact Inspection: Matthew                                         |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/87 |matthew-buglass                           |Done     |ID2, inspection             |                                                                                                                                                                         |1             |0.5         |
|Artifact Inspection: Mitchell                                        |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/92 |MitchWag01                                |Done     |ID2, inspection             |                                                                                                                                                                         |1             |            |
|Fix Bug With Jest config                                             |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/100|MitchWag01                                |Done     |ID2, test                   |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/101                                                                                     |1             |            |
|Write Gherkins for the 3D axis                                       |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/95 |LongQuanNguyen                            |Done     |Gherkin, ID2, test          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/127                                                                                     |1             |            |
|Write Gherkin for the 3D graph body                                  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/97 |trangnguyen3010                           |Won't Do |Gherkin, ID2, test          |                                                                                                                                                                         |1             |            |
|Write Gherkin for displaying points in 3D                            |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/96 |trangnguyen3010                           |Done     |Gherkin, ID2, test          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/126                                                                                     |1             |            |
|Risk Analysis: ID2                                                   |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/102|Aesha7, qpb948                            |Done     |ID2, risk estimation        |                                                                                                                                                                         |2             |1.5         |
|Dependabot#1: Prototype Pollution in `lodash`                        |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/104|Subzeero                                  |Done     |ID2                         |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/105                                                                                     |1             |1           |
|Add Artifacts to ID 2                                                |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/114|matthew-buglass                           |Done     |documentation, ID2          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/129                                                                                     |3             |4           |
|Cut ID2                                                              |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/115|matthew-buglass, Subzeero, trangnguyen3010|In Review|High Priority, ID2          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/pull/116                                                                                     |1             |1           |
                                                                           |5             |            |


### Class Standup Attendance
#### January 30th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
- Joe Mbonayo
##### Absent
- Zander Rommelaere (CSPIP interviews)

#### February 1st, 2024
##### In Attendance
- Tony Nguyen
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
##### Absent
- Zander Rommelaere (CSPIP interviews)
- Jesse Haug
- Joe Mbonayo

#### February 6th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Zander Rommelaere
##### Absent
- Trang Nguyen (Ill. Delivered update on discord)
- Quinn Brown (Ill. Delivered update on discord)
- Joe Mbonayo

#### February 8th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Zander Rommelaere
##### Absent
- Joe Mbonayo
- Trang Nguyen (Ill. Delivered update on discord)
- Aesha Patel (Ill. Delivered update on discord)
- Matthew Buglass (Doctor's appointment. Deliverd update on discord)
- Quinn Brown (Ill)

### Wiki Documents
- [Code Style](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Style-Sheet-for-Typescript-and-React)
- [Logging Configuration Guidance](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Logging-framework-log4js)
- [Sequence Diagram](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Architecture-Design-Records-(ADRs)#3-sequence-diagram)
- [Component Diagram](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Architecture-Design-Records-(ADRs)#4-component-diagram)

#### Inspections
- [Mitchell Wagner](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Artifact-Inspections#artifact-inspection-mitchell-wagner)
- [Tony Nguyen](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Artifact-Inspections#artifact-inspection-tony-nguyen)
- [Matthew Buglass](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Artifact-Inspections#artifact-inspection-matthew-buglass)

## ID3
### Work Planned
ID3 is going to be focused integrating the discrete components that we built in ID2. In ID3 we plan to have a full vertical slice of the system MVP: load into VR, load csv, show data on axes. Furthermore, we plan to start inteplementing the backend componenets for PCA, and missing data filtering. Here is a summaty of hte core development work and their associated testing cards:

|Title                                                                |URL                                                                                   |Assignees                                 |Status     |Labels                      |Linked pull requests                                                                                                                                                     |Estimate (hrs)|Actual (hrs)|
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------|------------------------------------------|-----------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|------------|
|Integrate Showing the data in 3D space                               |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/13 |                                          |Todo       |ID3, Required               |                                                                                                                                                                         |4             |            |
|Implement backend data exclusion for rows with missing data          |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/22 |                                          |Todo       |High Priority               |                                                                                                                                                                         |              |            |
|Implement backend for PCA                                            |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/24 |                                          |Todo       |High Priority               |                                                                                                                                                                         |              |            |
|UI interaction for point details                                     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/26 |                                          |Todo       |High Priority               |                                                                                                                                                                         |              |            |
|Fix Jest issue with ReactThreeFiber's implementation of Drei's Text component|https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/117|                                          |Todo       |ID3, QA                     |                                                                                                                                                                         |              |            |
|Write Gherkin for a happy path-test of data display and integration  |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/118|                                          |Todo       |Gherkin, ID3                |                                                                                                                                                                         |              |            |
|Write Gherkin for Data exclusion                                     |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/119|                                          |Todo       |Gherkin, ID3                |                                                                                                                                                                         |              |            |
|Write Gherkin for PCA backend                                        |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/120|                                          |Todo       |Gherkin, ID3                |                                                                                                                                                                         |              |            |
|Write Gherkin for UI interaction with a data point                   |https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/issues/121|                                          |Todo       |Gherkin, ID3                |                                                                                                                                                                         |              |            |


### ID3 Role Swaps
| Name                    	| Team 	|            Role 	|
|-------------------------	|-----:	|----------------:	|
| Matthew Buglass         	| N/A  	| Project Manager 	|
| Jesse Haug              	| Dev  	| Dev Lead        	|
| Aesha Patel             	| Dev  	| Risk Officer    	|
| Trang Nguyen            	| Dev  	| Build Master    	|
| Long Quan (Tony) Nguyen 	| Dev  	| Design Lead     	|
| Mitchell Wagner         	| QA   	| Test Lead       	|
| Joe Mbonayo             	| QA  	|                 	|
| Zander Rommelaere       	| QA  	| Build Master    	|
| Quinn Brown             	| QA  	| Risk Officer    	|
