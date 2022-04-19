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


function loadCalender() {
    console.log("hit hit hit");
    document.getElementById("plannerLoc").innerHTML = '<div class="row" styele="height:50px" id="days">----</div>';
    for (var day=0; day < NUMDAYS; day++) {
        document.getElementById("days").innerHTML += '<div class="col">' + days[day] + '</div>';
    }

    for (var time=0; time < NUMHOURS; time++) {
        document.getElementById("plannerLoc").innerHTML += '<div class="row" style="height:50px" id="' + time + '">'+ time + ':00</div>';
        document.getElementById("plannerLoc").innerHTML += '<div class="row" style="height:50px" id="' + (time + .5) + '">'+ time + ':30</div>';
            for (var fill=0; fill < NUMDAYS;fill++) {
                    document.getElementById(time).innerHTML += '<div class="col border"></div>';
                    document.getElementById(time + .5).innerHTML += '<div class="col border"></div>';
            }
        
    }
}