var NUMDAYS = 7
var NUMHOURS = 24

var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// Loads the calendar and creates a table of columns with ID = row - col
function loadCalender() {
    // check we're outputting 
    console.log("hit hit hit");

    //create first row and day of the week columns
    document.getElementById("plannerLoc").innerHTML = '<div class="row justify-content-center" styele="height:50px" id="days"></div>';
    document.getElementById("days").innerHTML += '<div class="col-1"></div>';
    for (var day=0; day < NUMDAYS; day++) {
        document.getElementById("days").innerHTML += '<div class="col">' + days[day] + '</div>';
    }

    //loop and create rows + first column for the time display
    for (var time=0; time < NUMHOURS; time++) {

        document.getElementById("plannerLoc").innerHTML += '<div class="row " style="height:25px" id="' + time + '"></div>';
        document.getElementById("plannerLoc").innerHTML += '<div class="row " style="height:25px" id="' + (time + .5) + '"></div>';
        document.getElementById(time).innerHTML         += '<div class="col-1">'+ time + ':00</div>';
        document.getElementById(time + .5).innerHTML    += '<div class="col-1">'+ time + ':30</div>';

        //create empty columns for coloring the calendar
        for (var fill=0; fill < NUMDAYS;fill++) {
                var colIDEvenTime = time.toString() + '-' + fill.toString();
                var colIDOddTime = (time + .5).toString() + '-' + fill.toString()
                document.getElementById(time).innerHTML += '<div class="col border bg-white" id = "' + colIDEvenTime + '"></div>';
                document.getElementById(time + .5).innerHTML += '<div class="col border bg-white" id = "' + colIDOddTime + '-' + fill + '"></div>';

                //add event listeners for drawing
                addIDListeners(colIDEvenTime);
                //addIDListeners(colIDOddTime);
        }
        
    }
}

//function creates event listeners for the ID passed to it
function addIDListeners(id){
    var ele = document.getElementById(id);
    
    ele.addEventListener('click', function drawOnCol(){
        console.log(ele);
        if (ele.classList.contains('bg-white')){
            ele.removeClass('bg-white');
            ele.addClass('bg-primary')
        }
        else {
            ele.removeClass('bg-primary');
            ele.addClass('bg-white');
        }
    });
}