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

const socketURL = window.location.hostname
const port = 
    window.location.port != ''
    ? ':'+ window.location.port 
    : ''
const socket = io(socketURL + port);

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

    for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
        document.getElementById("days").innerHTML += '<div class="col">' + daysAsString[dayIdx][0] + '</div>';
        document.getElementById("selectDay").innerHTML += '<option value="' + daysAsString[dayIdx] + '">' + daysAsString[dayIdx] + '</option>';
    }

    //loop and create rows + first column for the time display
    for (var timeIdx = 0; timeIdx < NUMHALFHOURS; timeIdx++) {
        document.getElementById("plannerLoc").innerHTML += '<div class="row" style="height:25px" id="' + timesAsString[timeIdx] + '"></div>';
        document.getElementById(timesAsString[timeIdx]).innerHTML += '<div class="col-1">' + timesAsString[timeIdx] + '</div>';
        document.getElementById("startTime").innerHTML += '<option value="' + timesAsString[timeIdx] + '">' + timesAsString[timeIdx] + '</option>';
        document.getElementById("endTime").innerHTML += '<option value="' + timesAsString[timeIdx] + '">' + timesAsString[timeIdx] + '</option>';

        //create empty columns for coloring the calendar
        for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
                var colID = dayIdx.toString() + '-' + timesAsString[timeIdx];
                document.getElementById(timesAsString[timeIdx]).innerHTML += '<div class="col border bg-white" href="#" id = "' + colID + 
                '" onmousedown="mouseDown(this.id, event)" onmousemove="mouseMove(this.id, event)" onmouseup="mouseUp(event)"></div>';
        }
    }
}

//loads the group planner from all users in the group
function loadGroupPlanner(){
    //create first row and day of the week columns
    document.getElementById("groupInfo").innerHTML = '<div class="row justify-content-center" style="height:25px" id="groupDays"></div>';
    document.getElementById("groupDays").innerHTML += '<div class="col-1"></div>';

    for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
        document.getElementById("groupDays").innerHTML += '<div class="col">' + daysAsString[dayIdx][0] + '</div>';
    }

    //loop and create rows + first column for the time display
    for (var timeIdx = 0; timeIdx < NUMHALFHOURS; timeIdx++) {
        document.getElementById("groupDays").innerHTML += '<div class="row " style="height:25px" id="' + 'group-' + timesAsString[timeIdx] + '"></div>';
        document.getElementById('group-' + timesAsString[timeIdx]).innerHTML += '<div class="col-1">' + timesAsString[timeIdx] + '</div>';

        //create empty columns for coloring the calendar
        for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
                var colID = 'group-' + dayIdx.toString() + '-' + timesAsString[timeIdx];
                document.getElementById('group-' + timesAsString[timeIdx]).innerHTML += '<div class="col border bg-white" id = "' + colID + '"></div>';
        }
    }
}

//draws from start time to end time
function drawFromRange(command){
    //validate the command
    if (!_validateAddRemove()){
        return
    }

    //get document inputs and convert to indices for easy lookup
    var startIdx = timesAsString.indexOf(document.getElementById("startTime").value);
    var endIdx = timesAsString.indexOf(document.getElementById("endTime").value);
    var dayIdx = daysAsString.indexOf(document.getElementById("selectDay").value);

    //loop from start to finish and draw according to the input command
    for (var timeIdx = startIdx; timeIdx <= endIdx; timeIdx++){
        var colID = dayIdx.toString() + '-' + timesAsString[timeIdx];
        var colElement = document.getElementById(colID);

        if (command == 'add' && colElement.classList.contains('bg-white')){
            colElement.classList.remove('bg-white');
            colElement.classList.add('bg-primary');
            userTimes[dayIdx][timeIdx] = 1;
        }

        else if (command == 'remove' && colElement.classList.contains('bg-primary')){
            colElement.classList.remove('bg-primary');
            colElement.classList.add('bg-white');
            userTimes[dayIdx][timeIdx] = 0;
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
    for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
        for (var timeIdx = 0; timeIdx < NUMHALFHOURS; timeIdx++){
            if (timesToDraw[dayIdx][timeIdx] == 1){
                var colID = 'group-' + dayIdx.toString() + '-' + timesAsString[timeIdx];
                var colElement = document.getElementById(colID);
                colElement.classList.remove('bg-white')
                colElement.classList.add('bg-primary');
            }
        }
    }
}

//resets the calendar 
function clearCalendar(group=false){
    for (var dayIdx = 0; dayIdx < NUMDAYS; dayIdx++) {
        for (var timeIdx = 0; timeIdx < NUMHALFHOURS; timeIdx++){
            if (group){
                var colID = 'group-' + dayIdx.toString() + '-' + timesAsString[timeIdx];
            }
            else{
                var colID = dayIdx.toString() + '-' + timesAsString[timeIdx];
            }
            var colElement = document.getElementById(colID);

            if (colElement.classList.contains('bg-primary')){
                colElement.classList.remove('bg-primary');
                colElement.classList.add('bg-white');
                if (!group){
                    userTimes[dayIdx][timeIdx] = 0;
                }
            }
        }
    }
}

//mouse has been pressed on a column, check for which action to perform
function mouseDown(id, ev){
    ev.preventDefault();
    var [dayString, timeString] = id.split('-'); 
    dayIdx = parseInt(dayString);
    timeIdx = timesAsString.indexOf(timeString);
    var ele = document.getElementById(id);

    if (ele.classList.contains('bg-white')){
        ele.classList.remove('bg-white');
        ele.classList.add('bg-primary');
        currentlyDrawing = true;
        userTimes[dayIdx][timeIdx] = 1;
    }

    else {
        ele.classList.remove('bg-primary');
        ele.classList.add('bg-white');
        currentlyRemoving = true;
        userTimes[dayIdx][timeIdx] = 0;
    }
    mousePressed = true;
}

//check if the mouse is pressed and entering a new column
function mouseMove(id, ev){
    ev.preventDefault();
    var [dayString, timeString] = id.split('-'); 
    dayIdx = parseInt(dayString);
    timeIdx = timesAsString.indexOf(timeString);
    
    if (mousePressed == true){
        var ele = document.getElementById(id);

        if (ele.classList.contains('bg-white') && currentlyDrawing){
            ele.classList.remove('bg-white');
            ele.classList.add('bg-primary');
            userTimes[dayIdx][timeIdx] = 1;
        }
        else if (currentlyRemoving) {
            ele.classList.remove('bg-primary');
            ele.classList.add('bg-white');
            userTimes[dayIdx][timeIdx] = 0;
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
    if (!_validateSubmission()){
        return
    }
    const data = {"groupID": groupID, "userID": userID, "data": convertLocalTimesToUTC(userTimes, userOffsetToUTC), "name": document.getElementById('name').value};
    socket.emit("times", data);
}

//validates the add or remove button is used properly
function _validateAddRemove(){
    var isValid = true
    //get document elemnts
    var start   = document.getElementById("startTime")
    var end     = document.getElementById("endTime")
    var day     = document.getElementById("selectDay")

    //convert to indices 
    var startIdx = timesAsString.indexOf(start.value);
    var endIdx   = timesAsString.indexOf(end.value);
    var dayIdx   = daysAsString.indexOf(day.value);

    //handle div validating
    if (startIdx == -1 || endIdx == -1 || startIdx >= endIdx){
        isValid = false;
        _invalidateElement(start);
        _invalidateElement(end);
    }

    else {
        _validateElement(start);
        _validateElement(end);
    }

    if (dayIdx == -1) {
        isValid = false;
        _invalidateElement(day);
    }

    else {
        _validateElement(day);
    }

    return isValid;
}

//validates the submission has all required fields
function _validateSubmission(){
    var isValid = true;
    var name = document.getElementById('name');
    if (name.value == ''){
        isValid = false;
        _invalidateElement(name);
    }
    else {
        _validateElement(name);
    }
    return isValid;
}

//helper functions to handle form validation 
function _validateElement(ele){
    ele.classList.remove('is-invalid');
    ele.classList.add('is-valid');
}

function _invalidateElement(ele){
    ele.classList.remove('is-valid');
    ele.classList.add('is-invalid');
}