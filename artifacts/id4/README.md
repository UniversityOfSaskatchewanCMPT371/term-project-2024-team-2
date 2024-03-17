# Artifacts and Summary for ID4

## Table of Contents
- [Table of Contents](#table-of-contents)
- [ID4 Summary](#id4-summary)
  - [Team Roles ID4](#team-roles-id4)
  - [Included PDF Documents](#included-pdf-documents)
  - [Knowledge Sharing and Pairing Sessions](#knowledge-sharing-and-pairing-sessions)
  - [Card and Work Summary](#card-and-work-summary)
  - [Testing Coverage](#testing-coverage)
  - [Class Standup Attendance](#class-standup-attendance)
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
- 

### Knowledge Sharing and Pairing Sessions
We have a group shared calendar to book meetings, standups, and pairing sessions.

#### Artifact Inspection - Aesha
- Duration: 1hr
- Attended by: Zander, Aesha, Quinn, Matthew
- Inspected Aesha's updated UI designs

#### Jast/Drei Pairing
- Duration: 1hr
- Attended by: Trang, Joe
- Joe passed off what he had done for looking at the Jest/Drei test issue

#### Matt and Jesse 1-on-1
- Duration: 1hr
- Attended by: Matt and Jesse
- PM/Dev Lead check in to addrtess any issues

#### Matt and Mitchell 1-on-1
- Duration: 1hr
- Attended by: Matt and Mitchell
- PM/Test Lead check in to adress any issues

#### Matt and Trang PM pairing 
- Duration: 1hr
- Attended by: Trang and Matt
- Met to plan the sprint and discuss the last one

#### Tutorial Time and Planning Poker
- Duration: 1.5hr
- Attended by: Matt, Tony, Jesse, Trang, Quinn, Zander, Mitchell, Aesha
- Met with most of the team to conduct planning poker, and give tutorials on PCA and the DAL

#### Joe and Matt pairing
- Duration: 1hr
- Attended by: Matt, Joe
- Met with Joe to get his repo fixed and set him up for pre-and-post condition work.

#### Lead pairing
- Duration: 1hr
- Attended by: Matt, Mitchell, Jesse
- Met with Jesse and Mitchell to discuss project state before code freeze

#### Cross Team Pairing
- Duration: 1hr
- Attended by: Matt, Ardalan (Team 3)
- Met with Ardalan to go over and dicuss PM challenges and activity log automations in Google Sheets/Excel

#### Zander and Matt Pairing
- Duration: 2.5hrs
- Attended by: Matt, Zander, with guest appearences of Mitchell, Aesha, and Quinn
- Met to trouble shoot Vite/Jest environment variable implementation issues.

#### DAL Pairing
- Duration: 2hrs
- Attended by: Jesse, Zander, Quinn
- Pair programmed the start of the DAL system, did some testing as well 

#### Chrome Warning Pairing
- Duration: 1.5hrs
- Attended by: Zander, Tony
- Investigate unsafe header warning in Chrome

#### Multi-level Logging Pairing
- Duration: 0.5hrs
- Attended by: Zander, Aesha
- Reseach options for multi-level level and make proposal

#### Rollbar Pairing
- Duration: 4.5hrs
- Attended by: Zander, Aesha
- Setup Rollbar accounts, replaced log4js methods, created LogAppender class for IndexedDB and testing

#### Test Hook SPIKE pairing
- Duration: 4.5hrs
- Attended by: Mitchell, Tony
- Walk through current test spike and how to complete

#### Smoke testing Brainstorm
- Duration: 3hrs
- Attended by: Mitchell, Tony, Matt
- Met to discuss testing feasibility and discuss options going forward.

#### Risk Plan update
- Duration: 0.5hrs
- Attended by: Aesha, Quinn
- Added new risks for ID4 and updated scores in risk plan


### Card and Work Summary
The goal of ID4 was 


#### In progress PRs
Due to unforseen complications and life, there were many pieces of work that had a lot of effort, but weren't able to get over the finish line. We still put them up in draft to get feedback and increase visibility.




#### Mini-Milestones / Work Cards
These are the cards that we commited do and that came up in the sprint. They were estimated using planning poker at our retro meeting. Actual time tracking was done through out activity log.


#### New Wiki Documents


#### Artifact Inspections


### Testing Coverage

```
> my-webxr-app@0.0.0 test
> NODE_ENV=test jest --coverage

----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------------|---------|----------|---------|---------|-------------------
All files                   |   82.78 |    46.34 |   76.74 |   82.26 |                   
 src                        |     100 |      100 |     100 |     100 |                   
  LogConfig.tsx             |     100 |      100 |     100 |     100 |                   
 src/components             |   75.26 |     36.2 |      60 |      75 |                   
  CreateTicks.tsx           |     100 |      100 |     100 |     100 |                   
  DataPoint.tsx             |   55.55 |    33.33 |      20 |   55.55 | 18-29,34-43       
  GenerateXYZ.tsx           |     100 |      100 |     100 |     100 |                   
  Positions.tsx             |     100 |    71.42 |     100 |     100 | 45                
  SingleAxis.tsx            |    65.9 |    21.62 |     100 |   65.11 | 43-58             
 src/contexts               |   86.66 |        0 |      75 |   85.71 |                   
  PointSelectionContext.tsx |   86.66 |        0 |      75 |   85.71 | 50,74             
 src/repository             |   97.91 |     87.5 |     100 |   97.87 |                   
  Column.tsx                |     100 |      100 |     100 |     100 |                   
  DataPoint.tsx             |     100 |      100 |     100 |     100 |                   
  DbRepository.tsx          |   97.05 |     87.5 |     100 |   96.96 | 17                
 src/testing                |     100 |      100 |     100 |     100 |                   
  TextInFileSearch.tsx      |     100 |      100 |     100 |     100 |                   
 src/utils                  |    79.8 |    64.28 |   70.58 |   78.78 |                   
  Assert.tsx                |     100 |      100 |     100 |     100 |                   
  CsvUtils.tsx              |   55.55 |        0 |   44.44 |   52.38 | 65-82,110-121     
  PcaClassic.tsx            |     100 |      100 |     100 |     100 |                   
  PcaCovariance.tsx         |     100 |      100 |     100 |     100 |                   
  StandardizeDataset.tsx    |   92.85 |    66.66 |     100 |   91.66 | 23                
----------------------------|---------|----------|---------|---------|-------------------
```

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
