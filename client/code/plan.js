const days = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
];
const times = [
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


var mousePressed = false;
var curentlyDrawing = false;
var currentlyRemoving = false;

// Loads the calendar and creates a table of columns with ID = row - col
function loadCalender() {
    //create first row and day of the week columns
    document.getElementById("plannerLoc").innerHTML = '<div class="row justify-content-center" styele="height:50px" id="days"></div>';
    document.getElementById("days").innerHTML += '<div class="col-1"></div>';

    for (var day = 0; day < NUMDAYS; day++) {
        document.getElementById("days").innerHTML += '<div class="col">' + days[day] + '</div>';
        document.getElementById("selectDay").innerHTML += '<option value="' + days[day] + '">' + days[day] + '</option>';
    }

    //loop and create rows + first column for the time display
    for (var time = 0; time < NUMHALFHOURS; time++) {
        document.getElementById("plannerLoc").innerHTML += '<div class="row " style="height:25px" id="' + times[time] + '"></div>';
        document.getElementById(times[time]).innerHTML += '<div class="col-1">' + times[time] + '</div>';
        document.getElementById("startTime").innerHTML += '<option value="' + times[time] + '">' + times[time] + '</option>';
        document.getElementById("endTime").innerHTML += '<option value="' + times[time] + '">' + times[time] + '</option>';

        //create empty columns for coloring the calendar
        for (var day = 0; day < NUMDAYS; day++) {
                var colID = times[time] + '-' + day.toString();
                document.getElementById(times[time]).innerHTML += '<div class="col border bg-white" href="#" id = "' + colID + 
                '" onmousedown="mouseDown(this.id, event)" onmousemove="mouseMove(this.id, event)" onmouseup="mouseUp(event)"></div>';
        }
    }
    //display group url and highlight
    var urlDisplay = document.getElementById('urlDisplay');
    urlDisplay.setAttribute('value', window.location.href);
    urlDisplay.select();

}

//draws from start time to end time
function drawFromRange(command){
    //get document inputs and convert to indices for easy lookup
    var startIndex = times.indexOf(document.getElementById("startTime").value);
    var endIndex = times.indexOf(document.getElementById("endTime").value);
    var dayIndex = days.indexOf(document.getElementById("selectDay").value);

    //loop from start to finish and draw according to the input command
    for (var timeIndex = startIndex; timeIndex <= endIndex; timeIndex++){
        var colID = times[timeIndex] + '-' + dayIndex.toString();
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

//resets the calendar 
function clearCalendar(){
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
            var colID = times[timeIndex] + '-' + dayIndex.toString();
            var colElement = document.getElementById(colID);

            if (colElement.classList.contains('bg-primary')){
                colElement.classList.remove('bg-primary');
                colElement.classList.add('bg-white');
                userTimes[dayIndex][timeIndex] = 0;
            }
        }
    }
}

//mouse has been pressed on a column, check for which action to perform
function mouseDown(id, ev){
    ev.preventDefault();
    var [timeString, dayString] = id.split('-')
    timeIndex = times.indexOf(timeString)
    dayIndex = parseInt(dayString);
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
    var [timeString, dayString] = id.split('-')
    timeIndex = times.indexOf(timeString)
    dayIndex = parseInt(dayString);

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


