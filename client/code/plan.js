const daysAsString = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
];
const timesAsString = [
    "0:00", "0:30", "1:00",
    "1:30", "2:00", "2:30",
    "3:00", "3:30", "4:00",
    "4:30", "5:00", "5:30",
    "6:00", "6:30", "7:00",
    "7:30", "8:00", "8:30",
    "9:00", "9:30", "10:00",
    "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30",
    "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00",
    "21:30", "22:00", "22:30",
    "23:00", "23:30", "24:00"
];
const socket = io("http://localhost:3000");

var prevBtnId = 'overlap'
var mousePressed = false;
var curentlyDrawing = false;
var currentlyRemoving = false;
//initial connection message to grab group times
socket.emit("hello", groupID);

//receives new group times whenever someone updates theirs
socket.on("times", (data) => {
    storeReceivedInfo(data);
    drawGroupButtons();
    drawGroupMember(prevBtnId)
});

function loadPlan(){
    loadUserPlanner();
    loadGroupPlanner();
     //display group url and highlight
    var urlDisplay = document.getElementById('urlDisplay');
    urlDisplay.setAttribute('value', window.location.href);
    urlDisplay.select();
}

// Loads the calendar and creates a table of columns with ID = row - col
function loadUserPlanner() {
    //create first row and day of the week columns
    document.getElementById("plannerLoc").innerHTML = '<div class="row justify-content-center" style="height:25px" id="days"></div>';
    document.getElementById("days").innerHTML += '<div class="col-1"></div>';

    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        document.getElementById("days").innerHTML += '<div class="col">' + daysAsString[dayIndex][0] + '</div>';
        document.getElementById("selectDay").innerHTML += '<option value="' + daysAsString[dayIndex] + '">' + daysAsString[dayIndex] + '</option>';
    }

    //loop and create rows + first column for the time display
    for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++) {
        document.getElementById("plannerLoc").innerHTML += '<div class="row" style="height:25px; width:1000px" id="' + timesAsString[timeIndex] + '"></div>';
        document.getElementById(timesAsString[timeIndex]).innerHTML += '<div class="col-1">' + timesAsString[timeIndex] + '</div>';
        document.getElementById("startTime").innerHTML += '<option value="' + timesAsString[timeIndex] + '">' + timesAsString[timeIndex] + '</option>';
        document.getElementById("endTime").innerHTML += '<option value="' + timesAsString[timeIndex] + '">' + timesAsString[timeIndex] + '</option>';

        //create empty columns for coloring the calendar
        for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
                var colID = dayIndex.toString() + '-' + timesAsString[timeIndex];
                document.getElementById(timesAsString[timeIndex]).innerHTML += '<div class="col border bg-white" href="#" id = "' + colID + 
                '" onmousedown="mouseDown(this.id, event)" onmousemove="mouseMove(this.id, event)" onmouseup="mouseUp(event)"></div>';
        }
    }
}

//loads the group planner from all users in the group
function loadGroupPlanner(){
    //create first row and day of the week columns
    document.getElementById("groupInfo").innerHTML = '<div class="row justify-content-center" style="height:25px" id="groupDays"></div>';
    document.getElementById("groupDays").innerHTML += '<div class="col-1"></div>';

    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        document.getElementById("groupDays").innerHTML += '<div class="col">' + daysAsString[dayIndex][0] + '</div>';
    }

    //loop and create rows + first column for the time display
    for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++) {
        document.getElementById("groupDays").innerHTML += '<div class="row " style="height:25px" id="' + 'group-' + timesAsString[timeIndex] + '"></div>';
        document.getElementById('group-' + timesAsString[timeIndex]).innerHTML += '<div class="col-1">' + timesAsString[timeIndex] + '</div>';

        //create empty columns for coloring the calendar
        for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
                var colID = 'group-' + dayIndex.toString() + '-' + timesAsString[timeIndex];
                document.getElementById('group-' + timesAsString[timeIndex]).innerHTML += '<div class="col border bg-white" id = "' + colID + '"></div>';
        }
    }
}

//draws from start time to end time
function drawFromRange(command){
    //get document inputs and convert to indices for easy lookup
    var startIndex = timesAsString.indexOf(document.getElementById("startTime").value);
    var endIndex = timesAsString.indexOf(document.getElementById("endTime").value);
    var dayIndex = daysAsString.indexOf(document.getElementById("selectDay").value);

    //loop from start to finish and draw according to the input command
    for (var timeIndex = startIndex; timeIndex <= endIndex; timeIndex++){
        var colID = dayIndex.toString() + '-' + timesAsString[timeIndex];
        var colElement = document.getElementById(colID);

        if (command == 'add' && colElement.classList.contains('bg-white')){
            colElement.classList.remove('bg-white');
            colElement.classList.add('bg-primary');
            userTimes[dayIndex][timeIndex] = 1;
        }

        else if (command == 'remove' && colElement.classList.contains('bg-primary')){
            colElement.classList.remove('bg-primary');
            colElement.classList.add('bg-white');
            userTimes[dayIndex][timeIndex] = 0;
        }
    }
}

//draws a button for each user added
function drawGroupButtons(){
    const buttonEle = document.getElementById('userSelector');
    buttonEle.innerHTML = '<button class="btn btn-outline-light" id="overlap" onclick="drawGroupMember (\'overlap\')">Group Info</button>';
    [...receivedDBInfo.keys()].forEach(key => {
        buttonEle.innerHTML += '<button class="btn btn-outline-light" id="' + key + '"onclick="drawGroupMember(\'' + key + '\')">' + key + '</button>';
    });
}

//selects user times to draw
function drawGroupMember(member){
    const eleID = document.getElementById('groupTitle')
    if (member == 'overlap'){
        drawGroupTimes(overlapTimes);
        eleID.innerHTML = "Group Availability";
        return;
    }
    if (!receivedDBInfo){
        return;
    }
    eleID.innerHTML = member + "'s Availability";
    drawGroupTimes(receivedDBInfo.get(member));
}

//function to draw times of selected user
function drawGroupTimes(timesToDraw){
    clearCalendar(true);
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
            if (timesToDraw[dayIndex][timeIndex] == 1){
                var colID = 'group-' + dayIndex.toString() + '-' + timesAsString[timeIndex];
                var colElement = document.getElementById(colID);
                colElement.classList.remove('bg-white')
                colElement.classList.add('bg-primary');
            }
        }
    }
}

//resets the calendar 
function clearCalendar(group=false){
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
            if (group){
                var colID = 'group-' + dayIndex.toString() + '-' + timesAsString[timeIndex];
            }
            else{
                var colID = dayIndex.toString() + '-' + timesAsString[timeIndex];
            }
            var colElement = document.getElementById(colID);

            if (colElement.classList.contains('bg-primary')){
                colElement.classList.remove('bg-primary');
                colElement.classList.add('bg-white');
                if (!group){
                    userTimes[dayIndex][timeIndex] = 0;
                }
            }
        }
    }
}

//mouse has been pressed on a column, check for which action to perform
function mouseDown(id, ev){
    ev.preventDefault();
    var [dayString, timeString] = id.split('-'); 
    dayIndex = parseInt(dayString);
    timeIndex = timesAsString.indexOf(timeString);
    var ele = document.getElementById(id);

    if (ele.classList.contains('bg-white')){
        ele.classList.remove('bg-white');
        ele.classList.add('bg-primary');
        currentlyDrawing = true;
        userTimes[dayIndex][timeIndex] = 1;
    }

    else {
        ele.classList.remove('bg-primary');
        ele.classList.add('bg-white');
        currentlyRemoving = true;
        userTimes[dayIndex][timeIndex] = 0;
    }
    mousePressed = true;
}

//check if the mouse is pressed and entering a new column
function mouseMove(id, ev){
    ev.preventDefault();
    var [dayString, timeString] = id.split('-'); 
    dayIndex = parseInt(dayString);
    timeIndex = timesAsString.indexOf(timeString);
    
    if (mousePressed == true){
        var ele = document.getElementById(id);

        if (ele.classList.contains('bg-white') && currentlyDrawing){
            ele.classList.remove('bg-white');
            ele.classList.add('bg-primary');
            userTimes[dayIndex][timeIndex] = 1;
        }
        else if (currentlyRemoving) {
            ele.classList.remove('bg-primary');
            ele.classList.add('bg-white');
            userTimes[dayIndex][timeIndex] = 0;
        }
    }
}

//resets the booleans controlling click and move filling
function mouseUp(ev){
    ev.preventDefault();

    if (mousePressed){
        mousePressed = false;
    }
    currentlyDrawing = false;
}

//submits current times to the server and grabs group overlap
function submit(){
    const data = {"groupID": groupID, "userID": userID, "data": convertLocalTimesToUTC(userTimes, userOffsetToUTC), "name": document.getElementById('name').value};
    socket.emit("times", data);
}