# Artifacts and Summary for ID4

## Table of Contents
- [Table of Contents](#table-of-contents)
- [ID4 Summary](#id4-summary)
  - [Team Roles ID4](#team-roles-id4)
  - [Included PDF Documents](#included-pdf-documents)
  - [Knowledge Sharing and Pairing Sessions](#knowledge-sharing-and-pairing-sessions)
  - [Card and Work Summary](#card-and-work-summary)
    - [In progress PRs](#in-progress-prs)
    - [Mini-Milestones / Work Cards](#mini-milestones--work-cards)
    - [New Wiki Documents](#new-wiki-documents)
    - [Artifact Inspections](#artifact-inspections)
  - [Class Standup Attendance](#class-standup-attendance)
    - [March 5th, 2024](#march-5th-2024)
    - [March 7th, 2024](#march-7th-2024)
    - [March 12th, 2024](#march-12th-2024)
    - [March 14th, 2024](#march-14th-2024)
- [ID5 Plan](#id5-plan)
  - [Work Planned](#work-planned)
  - [ID5 Role Swaps](#id5-role-swaps)


## ID4 Summary
### Team Roles ID4
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
- [ID3 Retro Jamboard](./id3_retro_jamboard.pdf)
- [ID3 Retro Minutes](./id3_retro_minutes.pdf)
- [ID4 Data Abstraction Layer Update](./id4_data_abstraction_layer_update.pdf)
- [ID4 Risk Plan](./id4_risk_plan.pdf)
- [ID4 Stakeholder Meeting Mar 14](./id4_stakeholder_meeting_mar_14.pdf)
- [ID4 Stakeholder Meeting Mar 7](./id4_stakeholder_meeting_mar_7.pdf)
- [ID4 Test Coverage](./id4_test_coverage.pdf)
- [ID4 Test List](./id4_test_list.pdf)
- [ID4 Test Matrix](./id4_test_matrix.pdf)
- [ID4 Test Team Update](./id4_test_team_update.pdf)

### Knowledge Sharing and Pairing Sessions
We have a group shared calendar to book meetings, standups, and pairing sessions.

##### Artifact Inspection - Aesha
- Duration: 1hr
- Attended by: Zander, Aesha, Quinn, Matthew
- Inspected Aesha's updated UI designs

##### Jast/Drei Pairing
- Duration: 1hr
- Attended by: Trang, Joe
- Joe passed off what he had done for looking at the Jest/Drei test issue

##### Matt and Jesse 1-on-1
- Duration: 1hr
- Attended by: Matt and Jesse
- PM/Dev Lead check in to addrtess any issues

##### Matt and Mitchell 1-on-1
- Duration: 1hr
- Attended by: Matt and Mitchell
- PM/Test Lead check in to adress any issues

##### Matt and Trang PM pairing 
- Duration: 1hr
- Attended by: Trang and Matt
- Met to plan the sprint and discuss the last one

##### Tutorial Time and Planning Poker
- Duration: 1.5hr
- Attended by: Matt, Tony, Jesse, Trang, Quinn, Zander, Mitchell, Aesha
- Met with most of the team to conduct planning poker, and give tutorials on PCA and the DAL

##### Joe and Matt pairing
- Duration: 1hr
- Attended by: Matt, Joe
- Met with Joe to get his repo fixed and set him up for pre-and-post condition work.

##### Lead pairing
- Duration: 1hr
- Attended by: Matt, Mitchell, Jesse
- Met with Jesse and Mitchell to discuss project state before code freeze

##### Cross Team Pairing
- Duration: 1hr
- Attended by: Matt, Ardalan (Team 3)
- Met with Ardalan to go over and dicuss PM challenges and activity log automations in Google Sheets/Excel

##### Zander and Matt Pairing
- Duration: 2.5hrs
- Attended by: Matt, Zander, with guest appearences of Mitchell, Aesha, and Quinn
- Met to trouble shoot Vite/Jest environment variable implementation issues.

##### DAL Pairing
- Duration: 2hrs
- Attended by: Jesse, Zander, Quinn
- Pair programmed the start of the DAL system, did some testing as well 

##### Chrome Warning Pairing
- Duration: 1.5hrs
- Attended by: Zander, Tony
- Investigate unsafe header warning in Chrome

##### Multi-level Logging Pairing
- Duration: 0.5hrs
- Attended by: Zander, Aesha
- Reseach options for multi-level level and make proposal

##### Rollbar Pairing
- Duration: 4.5hrs
- Attended by: Zander, Aesha
- Setup Rollbar accounts, replaced log4js methods, created LogAppender class for IndexedDB and testing

##### Test Hook SPIKE pairing
- Duration: 4.5hrs
- Attended by: Mitchell, Tony
- Walk through current test spike and how to complete

##### Smoke testing Brainstorm
- Duration: 3hrs
- Attended by: Mitchell, Tony, Matt
- Met to discuss testing feasibility and discuss options going forward.

##### Risk Plan update
- Duration: 0.5hrs
- Attended by: Aesha, Quinn
- Added new risks for ID4 and updated scores in risk plan


### Card and Work Summary
In ID4, we planned an extension to we we wanted to achieve in ID3. By the end of ID4, we wanted to have a fully-integrated happy-path test of loading and displaying data in the 3D space. We also aimed to finish the smoke testing spike to automate our smoke testing as much as possible. We got most of the way there, but again missed our mark. 

Good progress was made on the develoment front, but we discovered that our CSV loaders were not adequately load tested and crashed the browser when reading a file with half a million records and ten dimensions. That refactor, and development difficulties with transposing of the dataset to maintain within our 5Mibs of memory usage drastically slowed progress and prevented most of our dev work from getting over the finish line.

On the QA side, we had more success. We wrapped up two smoke testing SPIKEs and decided that creating a custom test hook to log internal states during manual testing and inspecting logs was going to be the most fruitful approach.


#### In progress PRs
Due to unforseen complications and life, there were many pieces of work that had a lot of effort, but weren't able to get over the finish line. We still put them up in draft to get feedback and increase visibility.




#### Mini-Milestones / Work Cards
These are the cards that we commited do and that came up in the sprint. They were estimated using planning poker at our retro meeting. Actual time tracking was done through our activity log.


#### New Wiki Documents
- [Data Abstraction Layer Design - Updated](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Architecture-Design-Records-(ADRs)#5-data-access-layer-dal-abstraction-design)
  - We decided to store PCA columns in a seperate table, instead of with the raw data


#### Artifact Inspections
- [Artifact Inspection - Aesha](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2024-team-2/wiki/Artifact-Inspections#artifact-inspection-aesha-patel)


### Class Standup Attendance
#### March 5th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
- Joe Mbonayo
- Zander Rommelaere
##### Absent

#### March 7th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
- Joe Mbonayo
- Zander Rommelaere
##### Absent


#### March 12th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
- Joe Mbonayo
- Zander Rommelaere
##### Absent


#### March 14th, 2024
##### In Attendance
- Tony Nguyen
- Jesse Haug
- Mitchell Wagner
- Matthew Buglass
- Aesha Patel
- Trang Nguyen
- Quinn Brown
- Zander Rommelaere
##### Absent
- Joe Mbonayo


## ID5 Plan
### Work Planned
In ID5


### ID5 Role Swaps
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
