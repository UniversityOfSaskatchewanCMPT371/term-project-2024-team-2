# Artifacts and Summary for ID3

## ID2 Summary
### Team Roles ID2
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

### Included PDF Documents


### Knowledge Sharing and Pairing Sessions:
We have a group shared calendar to book meetings, standups, and pairing sessions.

#### PM Pairing Session
- Duration: 2.5hrs
- Attended by: Trang, Matthew
- Paried on tasks for backlog refinement, sprint planning and backlog grooming for ID2, and preparing the ID1 presentation.

#### Design Jam
- Duration: 4.5hr
- Attended by: Aesha, Trang, Quinn, Tony, Jesse, Matt
- Caught up the team on what is in the repo, and worked on a data layer design as a team. This served as a 
meeting to ground everyone and ensure that we have a firm footings going into the last half of the term.


### Card and Work Summary
The goal of ID3 was going to be focused integrating the discrete components that we built in ID2. In ID3 we planmed to have a full vertical slice of the system MVP: load into VR, load csv, and show data on axes. Furthermore, we planned to start inteplementing the backend componenets for PCA, and missing data filtering.

#### Full slice / Happy Path
We got close to a fuyll happy-path. We can diplay plotted points, scaled appropriately with the axis, and can select and display alternative information assiciated with the points. The part that we are missing is the loading of the dataset into 3D space. Our CSV reader does work, but it is not currently hooked up to the data layer abstraction.

![data_hover](./imgs/data_hover.png)
![data_select](./imgs/data_select.png)

#### Backend Componenets
We were able to finish implementing the PCA analysis, though it is currently stand-alone and not connected to our data pipeline, that is coming in the next itteration. Out data filtering is implemented in our data pipeline, and is controlled by a boolena flag so that if we wanted to integrate special data handling for empy values, we can.

### Class Standup Attendance
#### Februrary 13th, 2024
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

#### Februrary 15th, 2024
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


#### Februrary 27th, 2024
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


#### Februrary 29th, 2024
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


### Wiki Documents


#### Inspections


## ID4
### Work Planned


### ID3 Role Swaps
| Name                    	| Team 	|            Role 	|
|-------------------------	|-----:	|----------------:	|
| Matthew Buglass         	| N/A  	| Project Manager 	|
| Jesse Haug              	| Dev  	| Dev Lead        	|
| Joe Mbonayo             	| Dev  	|                 	|
| Zander Rommelaere       	| Dev  	| Build Master    	|
| Quinn Brown             	| Dev  	| Risk Officer    	|
| Mitchell Wagner         	| QA   	| Test Lead       	|
| Aesha Patel             	| QA  	| Risk Officer    	|
| Trang Nguyen            	| QA  	| Build Master    	|
| Long Quan (Tony) Nguyen 	| QA  	| Design Lead     	|
