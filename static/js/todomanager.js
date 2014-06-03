/*
*Function for creating the Task Object.
*/
function Task( taskTitle, taskDesciption, taskPriority ){
	var randomNumber = Math.floor((Math.random() * 10000000) + 1);
	this.task_id = "Task" + randomNumber;
	this.task_Title = taskTitle;
	this.task_Desciption = taskDesciption;
	this.task_Priority = taskPriority;
}

/*
*Deals with all Data of the project
*/
var MODEL = function(){
	var fullTaskList = {"tasklist":{"todo":[],"wip":[],"completed":[]}};
	addToTODO = function(task){
		fullTaskList.tasklist.todo.push(task);
		return task;
	},
	addToWIP = function(task){
		fullTaskList.tasklist.wip.push(task);
	},
	addToCompleted = function(task){
		fullTaskList.tasklist.completed.push(task);
	},
	removeFromToDo = function(taskID){
		var todolist = fullTaskList.tasklist.todo;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(todolist,"task_id", taskID );
		var deletedTask = todolist.splice(itemIndex,1)[0];
		return deletedTask;
	},
	removeFromWIP = function(taskID){
		var wiplist = fullTaskList.tasklist.wip;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(wiplist,"task_id", taskID );
		var deletedTask = wiplist.splice(itemIndex,1)[0];
		return deletedTask;
	},
	removeFromCompleted = function(taskID){
		var completedlist = fullTaskList.tasklist.completed;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(completedlist,"task_id", taskID );
		var deletedTask = completedlist.splice(itemIndex,1)[0];
		return deletedTask;
	},
	deleteTaskFromList =function (currentStage, taskid){
		var deletedTask;
		if(currentStage === "todo"){
			deletedTask = removeFromToDo(taskid);
		}else if(currentStage === "workinprogress"){
			deletedTask = removeFromWIP(taskid);
		}else if(currentStage === "completed"){
			deletedTask = removeFromCompleted(taskid);
		}
		return deletedTask;
	};
	return {
		addToTODO : addToTODO,
		addToWIP : addToWIP,
		addToCompleted : addToCompleted,
		deleteTaskFromList : deleteTaskFromList
	};

}();

/*
*Deals with all the UI(DOM) interaction.
*/
var VIEW = function () {
	var todoColumnElement = document.getElementById("todo");
	var workinprogressColumnElement = document.getElementById("workinprogress");
	var completedColumnElement = document.getElementById("completed");
	/*
	*creates the template for appending the task in the dom.
	*input: the task oobject, and the stage to which the task is to be added.
	*Html string of the template which is to be created.
	*/
	TempleteCreator = function(newTaskObject, stage){
		var taskTemplate = [], htmlElement;
		taskTemplate[0] = "<li id = \"taskElement\" class = \"priority"+newTaskObject.task_Priority +"\"  taskid = "+ newTaskObject.task_id +"><div class = \"title\">";
		taskTemplate[1] = newTaskObject.task_Title;
		taskTemplate[2] = "</div><img class = \"deleteimage\" src=\"./static/images/deleteimage.jpg\">";
		taskTemplate[3] = "<div class=\"description\">";
		taskTemplate[4] = newTaskObject.task_Desciption;
		taskTemplate[6] = "</div>";
		if(stage !== "completed"){
			taskTemplate[7] = "<div class= \"move_to_next_stage\"> MOVE>> </div>";
		} else {
			taskTemplate[7] = "";
		}
		taskTemplate[8] = "</li>";
		htmlElement = taskTemplate.join("");
		return htmlElement;
	},
	addElementInToDo = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "todo");
		todoColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	},
	addElementInWIP = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "workinprogress");
		workinprogressColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	},
	addElementInCompleted = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "completed");
		completedColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	},
	removeElementInToDo = function(taskid){
		var elementToDelete = todoColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		todoColumnElement.removeChild(elementToDelete);
	},
	removeElementInWIP = function(taskid){
		var elementToDelete = workinprogressColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		workinprogressColumnElement.removeChild(elementToDelete);
	},
	removeElementInCompleted = function(taskid){
		var elementToDelete = completedColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		completedColumnElement.removeChild(elementToDelete);
	},
	removeElementFromStage = function(currentStage, taskid){
		if(currentStage === "todo"){
			removeElementInToDo(taskid);
		}else if(currentStage === "workinprogress"){
			removeElementInWIP(taskid);
		}else if(currentStage === "completed"){
			removeElementInCompleted(taskid);
		}
	},
	/*
	*Retrieves  the values from the add task session
	*show notification if necessary
	*Creates new task object and clears the fields if everything is correct.
	*/
	createTask = function(){
	var tasktitle = document.getElementById("tasktitle").value;
	if(tasktitle.trim() === ""){
		document.getElementById("notification").innerText = "* Task Title cannot be empty!!";
		return false;
	}
	var taskdescription = document.getElementById("taskdescription").value;
	var taskpriority = document.getElementById("taskpriority").value;
	resetFields();
	var newTask = new Task(tasktitle , taskdescription , taskpriority);
	return newTask;
	},
	/*
	*Resets all the input fields in the add Task session.
	*/	
	resetFields = function (){
	document.getElementById("tasktitle").value = "";
	document.getElementById("taskdescription").value = "";
	document.getElementById("taskpriority").value = 1;
	document.getElementById("notification").innerText = "";
	};
	return{
		createTask:createTask,
		addElementInToDo : addElementInToDo,
		addElementInWIP : addElementInWIP,
		addElementInCompleted : addElementInCompleted,
		removeElementInToDo : removeElementInToDo,
		removeElementInWIP : removeElementInWIP,
		removeElementInCompleted : removeElementInCompleted,
		removeElementFromStage:removeElementFromStage
	}
}();

/*
*Deals with all the Interactions between Model, View and Actions.
*/
var CONTROLLER = function (){
	
	addNewTask = function(){
		var task = VIEW.createTask();
		if(task === null || task === false){
			return;
		}
		var newTaskObject = MODEL.addToTODO(task);
		VIEW.addElementInToDo(newTaskObject);
	},
	/*
	*Deals with All action on in the task.
	*Delete task and move task is handled here.
	*/
	clickOnTaskElement = function(ev){
		var target = ev.target || ev.srcElement;
		var sourceElementClass = target.className;
		var currentStage, taskid;
		currentStage = ev.currentTarget.id;
		if(sourceElementClass === "deleteimage"){
			var deleteConfirm = confirm("This task will be deleted.");
			if(deleteConfirm === false){
				return;
			}
			taskid = target.parentElement.getAttribute("taskid");
			deleteTask(currentStage, taskid);
		}
		if(sourceElementClass === "move_to_next_stage"){
			taskid = target.parentElement.getAttribute("taskid");
			moveTask(currentStage, taskid);
		}
	},
	/*
	*Deletes the task from the current list in Model.
	*Delete the task from view in current stage.
	*Add the task to next stage in the model
	*Add the Task to next stage in the view.
	*/
	moveTask = function(currentStage, taskid){
		var deletedTask = MODEL.deleteTaskFromList(currentStage, taskid);
		VIEW.removeElementFromStage(currentStage, taskid);
		if(currentStage === "todo"){
			MODEL.addToWIP(deletedTask);
			VIEW.addElementInWIP(deletedTask);
		}else if(currentStage === "workinprogress"){
			MODEL.addToCompleted(deletedTask);
			VIEW.addElementInCompleted(deletedTask);
		}
	},
	/*
	*Delete the task from the current stage in model.
	*Delete the task fromthe current stage in view.
	*/
	deleteTask = function(currentStage, taskid){
		MODEL.deleteTaskFromList(currentStage, taskid);
		VIEW.removeElementFromStage(currentStage, taskid);
	};
	return{
		clickOnTaskElement:clickOnTaskElement,
		addNewTask:addNewTask
	};
}();

var UTILS = function () {
	/*
	*input: an Array of objects, a key and value.
	*output: index of the first object in the array which has a key having the  specified value.
	*/
	findIndexInArrayWithKeyValuePair = function (arr, key, value) {
    	for (var i = 0; i < arr.length; i++) {
     	  	if (arr[i][key] === value) {
          		return(i);
       		}
    	}
    	return(-1);
	};
	return{
		findIndexInArrayWithKeyValuePair:findIndexInArrayWithKeyValuePair
	};
}();
/*
*Adds all the event handlers required for the project dynamically.
*
*/
AttachEventHandlers();
function AttachEventHandlers(){
	AddEvent(document.getElementById("addTaskButton"),"click",CONTROLLER.addNewTask);
	AddEvent(document.getElementById("todo"),"click",CONTROLLER.clickOnTaskElement);
	AddEvent(document.getElementById("workinprogress"),"click",CONTROLLER.clickOnTaskElement);
	AddEvent(document.getElementById("completed"),"click",CONTROLLER.clickOnTaskElement);
}

/*
*Multibrowser Event Handlers which can be generically used.
*/
function AddEvent(html_element, event_name, event_function) 
{       
   if(html_element.attachEvent) //Internet Explorer
      html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);}); 
   else if(html_element.addEventListener) //mordern browsers
      html_element.addEventListener(event_name, event_function, false);          
} 
