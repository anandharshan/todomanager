TO DO MANAGER Docummentation:::
--------------------------------
TO DO LIST is immplemented only usinf HTML, CSS, and Javascript ( no Libraries used )

* As a knowledge worker I want to keep track of my outstanding tasks by creating a new task very quickly
we can add new task to the to do list by filling the required columns in the left side section and clicking the  ADD TASK button.
Relevant validation is provided for required columns and notification will be given in case of any validation failure.
We will be clearing the input field automatically after each task is created. So that knowledge worker can add multiple tasks easily.

* As a knowledge worker I want to decide what to work on next by viewing a list of all of my outstanding tasks
The knowledge worker is given a list of tasks which he can easily choose and make it to "Work in progress" by easily clicking the "move >>" button. There is also prioirty fields, which gives color coding to the task left side. (red: prioirty-1; blue : prioirty-2 ; yellow : prioirty-3). So the user can easily recognize the higher prioirty tasks.

* As a knowledge worker I want to enjoy making progress by marking a completed task as "done"
The knowledge worker can easily make progress by making the task hes currently working on as "work in progress", and once hes done with the  task, he can move the task to completed.

* As a knowledge worker I want to respond to changing circumstances by deleting tasks that I no longer need to do
The Knowledge work can easily delete the  task from any stage according to changing circumstances, by clicking the "X" button on top right  of  each Task.

* As a knowledge worker I want to plan my work by placing more important tasks at the top of my to do list
This feature is not implemented yet. As it will take up lot more time. But surely this code can be extended to attain this functionality as well.
I was thinking about implementing "drag and droppping" of tasks as well for moving the tasks and prioritizing the tasks. which makes the knowledge worker action more efficient.

* As a knowledge worker I want to be very efficient by navigating my task list using the keyboard
This feature is not implemented.

Running the project:
--------------------
1. Extract the folder to some location.
2. open the ToDoManager.html file in a browser.
(Tested and verified in Chrome and Firefox)

coding practices::
---------------------
1. Revealing module pattern is used through out in the project.
2. MVC pattern is tried to be mocked in the project.
3. only vanilla java script is used in the project as per your specification.
4. Object oriented principles are used where applicable.
 
The Future of this project::
-----------------------------
1. Drag and Drop Can be implemented for moving the tasks.
As this will give more usability to the user. 
priority wise ordering in each stages with dnd.

2. As all the action is stored in the model. this can be saved easily in the back - end or even cached  in local storage. 
 