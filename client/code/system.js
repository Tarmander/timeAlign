const NUMDAYS = 7;
const NUMHALFHOURS = 48;
const groupID = grabIDFromURL();
const userID = generateUserID();

//create array representation of days and times. 
var userTimes = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 

function appendUniqueQuery(){
    var id = Date.now()
    planner = document.getElementById('newPlanner');
    planner.href = planner.href + '?id=' + id.toString();
    return false;
}

function appendExistingQuery(){
    planner = document.getElementById('planner');
    id = document.getElementById('groupID').value;
    planner.href = planner.href + '?id=' + id;
    return false;
}

function grabIDFromURL()
{
    var url = new URL(window.location.href)
    return url.searchParams.get('id');

}

function generateUserID()
{
    return Math.floor(Math.random() * 100);
}

//moves indices from local to UTC, handles rollovers
function convertLocalTimesToUTC(times){
    //create UTC converted array
    var timesUTC = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 
    //const userOffsetToUTC = (new Date().getTimezoneOffset() / 60) * 2; // Offset from UTC time in half hours
    const userOffsetToUTC = -14
    var rolloverArray = Array(Math.abs(userOffsetToUTC)).fill(0); 

    if (userOffsetToUTC >= 0){
        for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++){
            timesUTC[dayIndex].splice(0, userOffsetToUTC, ...rolloverArray);
            rolloverArray.fill(0);
    
            for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
    
                var offSetIndex = userOffsetToUTC + timeIndex;
                var value = times[dayIndex][timeIndex];
    
                //check for rollover
                if (offSetIndex >= NUMHALFHOURS){
                    offSetIndex -= NUMHALFHOURS;
                    rolloverArray[offSetIndex] = value
                }
                else{
                    timesUTC[dayIndex][offSetIndex] = value
                }
            }
        }
    
        //Sunday rollover left over
        timesUTC[0].splice(0, userOffsetToUTC, ...rolloverArray);
        console.log(timesUTC)
        
    }
    else{
        for (var dayIndex = 6; dayIndex >= 0; dayIndex--){
            timesUTC[dayIndex].splice(NUMHALFHOURS + userOffsetToUTC + 1, Math.abs(userOffsetToUTC), ...rolloverArray);
            console.log(rolloverArray);
            rolloverArray.fill(0);
    
            for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
    
                var offSetIndex = userOffsetToUTC + timeIndex;
                var value = times[dayIndex][timeIndex];
    
                //check for rollover
                if (offSetIndex < 0){
                    offSetIndex += Math.abs(userOffsetToUTC);
                    rolloverArray[offSetIndex] = value
                }
                else{
                    timesUTC[dayIndex][offSetIndex] = value
                }
            }
        }
    
        //Saturday rollover left over
        timesUTC[6].splice(NUMHALFHOURS + userOffsetToUTC + 1, Math.abs(userOffsetToUTC), ...rolloverArray);
        console.log(timesUTC)
    }
    return timesUTC;
}

//takes 2D array representing [day][time] and returns 1D array of ints representing the times of each day
function  convertAllTimesToIntArray(timesUTC){
    var result = []
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        result.push(_converTimeArrayToInt(timesUTC[dayIndex]))
    }

    return result;
}

//converts integer array of all times in the week to 2D array representing [day][time]
function convertIntArrayToAllTimes(timesInt){
    var result = []
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++){
        result.push(_convertIntToTimes(timesInt[dayIndex]))
    }
    return result;
}

function sendTimesToServer(times){
    const data = {"groupID": groupID, "userID": userID, "data": convertAllTimesToIntArray(convertLocalTimesToUTC(times)), "name": "Kevin"};
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    //fetch('http://localhost:3000/update', options);
}

async function requestOverlappingGroupTimes(){
    const data = {"groupID" : groupID}
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    fetch('http://localhost:3000/retrieve', options)
        .then(response => response.json())
        .then(data => {console.log(data)});
}

//submits current times to the server and grabs group overlap
function submit(){
    sendTimesToServer(userTimes);
    //requestOverlappingGroupTimes();
}

//converts array of times in a single day to integer
function _converTimeArrayToInt(times){
    var newNum = times[0];
    for (var timeIndex = 1; timeIndex < NUMHALFHOURS; timeIndex++){
        newNum = (newNum << 1) || times[timeIndex];
    }
    return newNum
    
}

//converts integer representation of times to array 
function _convertIntToTimes(timeInt){
    result = []
    for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
        result.unshift(timeInt & 1);
        timeInt = timeInt >> 1;
    }
    return result;
}