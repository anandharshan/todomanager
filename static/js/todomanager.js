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
*STORAGE MODULE
*Deals with the local Storage Part of the Application.
*/
var STORAGE = function(){
	//function for storing in Local storage.
	//expects two parameter:: itemname : string, itemObject:Object
	var setData = function(itemName, itemObject){
		var dataString = JSON.stringify(itemObject);
		localStorage.setItem(itemName, dataString);
	};
	//function for retrieving in Local storage.
	//expects one parameter:: itemname : string.
	//return Object.
	var getData = function(itemName){
		var dataString = localStorage.getItem('taskList');
		var dataObj = JSON.parse(dataString);
		return dataObj;
	};
	return{
		setData:setData,
		getData:getData
	};
}();

/*
*Deals with all Data of the project
*/
var MODEL = function(){
	var fullTaskList = {"tasklist":{"todo":[],"wip":[],"completed":[]}};
	var LSVARIABLENAME = 'taskList';
	var persistData = function (){
		STORAGE.setData(LSVARIABLENAME, fullTaskList);
	};
	var retrieveData = function(){
		var data = STORAGE.getData(LSVARIABLENAME);
		if( data != null) {
			fullTaskList = data;
		}else{
			data = fullTaskList;
		}
		return data;
	}
	var addToTODO = function(task){
		fullTaskList.tasklist.todo.push(task);
		return task;
	};
	var addToWIP = function(task){
		fullTaskList.tasklist.wip.push(task);
	};
	var addToCompleted = function(task){
		fullTaskList.tasklist.completed.push(task);
	};
	var removeFromToDo = function(taskID){
		var todolist = fullTaskList.tasklist.todo;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(todolist,"task_id", taskID );
		var deletedTask = todolist.splice(itemIndex,1)[0];
		return deletedTask;
	};
	var removeFromWIP = function(taskID){
		var wiplist = fullTaskList.tasklist.wip;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(wiplist,"task_id", taskID );
		var deletedTask = wiplist.splice(itemIndex,1)[0];
		return deletedTask;
	};
	var removeFromCompleted = function(taskID){
		var completedlist = fullTaskList.tasklist.completed;
		var itemIndex = UTILS.findIndexInArrayWithKeyValuePair(completedlist,"task_id", taskID );
		var deletedTask = completedlist.splice(itemIndex,1)[0];
		return deletedTask;
	};
	var deleteTaskFromList =function (currentStage, taskid){
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
		deleteTaskFromList : deleteTaskFromList,
		persistData:persistData,
		retrieveData:retrieveData
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
	var TempleteCreator = function(newTaskObject, stage){
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
	};
	var initializeToDoList = function(fullList){
		var todoarray = fullList.tasklist.todo;
		var wiparray = fullList.tasklist.wip;
		var completedarray = fullList.tasklist.completed;
		for (i=0;i < todoarray.length; i++){
			addElementInToDo(todoarray[i]);
		}
		for (i=0;i < wiparray.length; i++){
			addElementInWIP(wiparray[i]);
		}
		for (i=0;i < completedarray.length; i++){
			addElementInCompleted(completedarray[i]);
		}
	};
	var addElementInToDo = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "todo");
		todoColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	};
	var addElementInWIP = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "workinprogress");
		workinprogressColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	};
	var addElementInCompleted = function(newTaskObject){
		var htmlElement = TempleteCreator(newTaskObject, "completed");
		completedColumnElement.insertAdjacentHTML('beforeend', htmlElement);
	};
	var removeElementInToDo = function(taskid){
		var elementToDelete = todoColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		todoColumnElement.removeChild(elementToDelete);
	};
	var removeElementInWIP = function(taskid){
		var elementToDelete = workinprogressColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		workinprogressColumnElement.removeChild(elementToDelete);
	};
	var removeElementInCompleted = function(taskid){
		var elementToDelete = completedColumnElement.querySelectorAll("li[taskid="+ taskid +"]")[0];
		completedColumnElement.removeChild(elementToDelete);
	};
	var removeElementFromStage = function(currentStage, taskid){
		if(currentStage === "todo"){
			removeElementInToDo(taskid);
		}else if(currentStage === "workinprogress"){
			removeElementInWIP(taskid);
		}else if(currentStage === "completed"){
			removeElementInCompleted(taskid);
		}
	};
	/*
	*Retrieves  the values from the add task session
	*show notification if necessary
	*Creates new task object and clears the fields if everything is correct.
	*/
	var createTask = function(){
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
	};
	/*
	*Resets all the input fields in the add Task session.
	*/	
	var resetFields = function (){
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
		removeElementFromStage:removeElementFromStage,
		initializeToDoList : initializeToDoList
	};
}();

/*
*Deals with all the Interactions between Model, View and Actions.
*/
var CONTROLLER = function (){
	
	var addNewTask = function(){
		var task = VIEW.createTask();
		if(task === null || task === false){
			return;
		}
		var newTaskObject = MODEL.addToTODO(task);
		VIEW.addElementInToDo(newTaskObject);
	};
	/*
	*Deals with All action on in the task.
	*Delete task and move task is handled here.
	*/
	var clickOnTaskElement = function(ev){
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
	};
	/*
	*Deletes the task from the current list in Model.
	*Delete the task from view in current stage.
	*Add the task to next stage in the model
	*Add the Task to next stage in the view.
	*/
	var moveTask = function(currentStage, taskid){
		var deletedTask = MODEL.deleteTaskFromList(currentStage, taskid);
		VIEW.removeElementFromStage(currentStage, taskid);
		if(currentStage === "todo"){
			MODEL.addToWIP(deletedTask);
			VIEW.addElementInWIP(deletedTask);
		}else if(currentStage === "workinprogress"){
			MODEL.addToCompleted(deletedTask);
			VIEW.addElementInCompleted(deletedTask);
		}
	};
	/*
	*Delete the task from the current stage in model.
	*Delete the task fromthe current stage in view.
	*/
	var deleteTask = function(currentStage, taskid){
		MODEL.deleteTaskFromList(currentStage, taskid);
		VIEW.removeElementFromStage(currentStage, taskid);
	};
	var initializeDataAndRender = function(){
		var initalList = MODEL.retrieveData();
		VIEW.initializeToDoList(initalList);
	};
	
	var storeDataInLocalStorage = function(){
		MODEL.persistData();
	};
	return{
		clickOnTaskElement:clickOnTaskElement,
		addNewTask:addNewTask,
		initializeDataAndRender:initializeDataAndRender,
		storeDataInLocalStorage:storeDataInLocalStorage
	};
}();

var UTILS = function () {
	/*
	*input: an Array of objects, a key and value.
	*output: index of the first object in the array which has a key having the  specified value.
	*/
	var findIndexInArrayWithKeyValuePair = function (arr, key, value) {
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
*/
AttachEventHandlers();
function AttachEventHandlers(){
	AddEvent(document.getElementById("addTaskButton"),"click",CONTROLLER.addNewTask);
	AddEvent(document.getElementById("todo"),"click",CONTROLLER.clickOnTaskElement);
	AddEvent(document.getElementById("workinprogress"),"click",CONTROLLER.clickOnTaskElement);
	AddEvent(document.getElementById("completed"),"click",CONTROLLER.clickOnTaskElement);
};
window.onload = CONTROLLER.initializeDataAndRender;
window.onunload = CONTROLLER.storeDataInLocalStorage;

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
