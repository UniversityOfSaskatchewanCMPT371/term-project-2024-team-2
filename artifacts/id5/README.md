# Artifacts and Summary for ID5

## Table of Contents
- [Table of Contents](#table-of-contents)
- [ID5 Summary](#id5-summary)
  - [Team Roles ID5](#team-roles-id5)
  - [Included PDF Documents](#included-pdf-documents)
  - [Knowledge Sharing and Pairing Sessions](#knowledge-sharing-and-pairing-sessions)
  - [Card and Work Summary](#card-and-work-summary)
    - [Mini-Milestones / Work Cards](#mini-milestones--work-cards)
    - [Pre- and Post-Conditions](#pre--and-post-conditions)
    - [Multi-level Logging](#multi-level-logging)
    - [Undiagnosed bugs](#undiagnosed-bugs)
    - [Activity Logging](#activity-logging)
    - [New Wiki Documents](#new-wiki-documents)
    - [Artifact Inspections](#artifact-inspections)
  - [Class Standup Attendance](#class-standup-attendance)
    - [March 5th, 2024](#march-5th-2024)
    - [March 7th, 2024](#march-7th-2024)
    - [March 12th, 2024](#march-12th-2024)
    - [March 14th, 2024](#march-14th-2024)
- [Project Reflection](#project-reflection)



## ID5 Summary
### Team Roles ID5
| Name                    	| Team 	|            Role 	|
|-------------------------	|-----:	|----------------:	|
| Matthew Buglass         	| N/A  	| Project Manager 	|
| Jesse Haug              	| Dev  	| Dev Lead        	|
| Aesha Patel             	| Dev  	| Risk Officer    	|
| Trang Nguyen            	| Dev  	| Build Master    	|
| Long Quan (Tony) Nguyen 	| Dev  	| Design Lead     	|
| Mitchell Wagner         	| QA   	| Test Lead       	|
| Zander Rommelaere       	| QA  	| Build Master    	|
| Quinn Brown             	| QA  	| Risk Officer    	|

### Included PDF Documents


### Knowledge Sharing and Pairing Sessions
We have a group shared calendar to book meetings, standups, and pairing sessions.

##### Artifact Inspection - 
- Duration: 
- Attended by: 
- Inspected 

##### Artifact Inspection -
- Duration:
- Attended by: 
- Inspected 

##### Item
- Duration:
- Attended by:
- 



### Card and Work Summary



#### Mini-Milestones / Work Cards
These are the cards that we committed do and that came up in the sprint. They were estimated using planning poker at our retro meeting. Actual time tracking was done through our activity log.

In ID5, we will be aimed to finish up that vertical slice and implement our custom testing hooks. 

The biggest issue of note was the changing of our testing framework. Because we could not access environment variables in both Jest and when running under Vite, we decided to pivot our testing framework to Vitest. Fortunately because Vitest uses a Jest=compatible interface, the change was a non-issue.


#### Pre- and Post-Conditions
A big push this iteration was geting more extensive docstring and pre- and post-conditions. New code required the inclusion of pre- and post-conditions and we went back through old code to update docstrings and add pre- and post-conditions

#### Multi-level Logging
It was determined that Log4js is incompatible with Vite. A decision was made to switch our logging framework to Rollbar. However, it was not merged in this deliverable as, due to how Vite and Jest reference environment variables, we were not able to get the application working and the tests passing at the same time.

#### Undiagnosed bugs
Estimation derived using the Capture-Recapture method from:
1. S. Biffl, . "Evaluating defect estimation models with major defects".Journal of Systems and Software 65, no.1 (2003): 13-29.
2. Otis, David L., Kenneth P. Burnham, Gary C. White, and David R. Anderson. “Statistical Inference from Capture Data on Closed Animal Populations.” Wildlife Monographs, no. 62 (1978): 3–135. http://www.jstor.org/stable/3830650.

Let the total population of bugs be defined as $N$, the number of bugs found by teams A and B be $n_A$ and $n_B$, respectively, and let the number of bugs found by both teams be $m$. Then, from Otis et al, our total population of bugs would be:
$$N=\frac{n_An_B}{m}=\frac{3 \times 4}{2}=12$$
Therefore given the tested scope, we likely have 6 undiagnosed bugs. However, because our PCA calculations are not connected to the UI, they were not included in this testing. The PCA specific sections of the code are approximately 5% of our source code. Therefore, the adjusted number of bugs as of yet undiagnosed is:
$$N_{total}=120.95=12.6313$$
$$N_{undiagnosed}=N_{total}-N_{found}=13-6=7$$
We estimate that there are 7 undiagnosed major and minor bugs remaining in the system.



#### Activity Logging


##### Actual vs Expected Time


##### Summary Charts



#### New Wiki Documents
- 


#### Artifact Inspections
- 


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

## Project Reflection

