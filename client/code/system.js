const NUMDAYS = 7;
const NUMHALFHOURS = 48;
const groupID = grabIDFromURL();
const userID = getUserID();
const userOffsetToUTC = (new Date().getTimezoneOffset() / 60) * 2; // Offset from UTC time in half hours

//create array representation of days and times. 
var userTimes = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 
var overlapTimes = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 

//storage for DB callback info for userTimes
var receivedDBInfo = new Map();

//appends new groupID to the url
function appendUniqueQuery(){
    var id = Date.now()
    planner = document.getElementById('newPlanner');
    planner.href = planner.href + '?id=' + id.toString();
    return false;
}

//appends existing groupID to the url
function appendExistingQuery(){
    planner = document.getElementById('planner');
    id = document.getElementById('groupID').value;
    planner.href = planner.href + '?id=' + id;
    return false;
}

//grabs the groupID form the url and returns it
function grabIDFromURL()
{
    var url = new URL(window.location.href)
    return url.searchParams.get('id');
}

//grabs user ID from a cookie or creates a new one if it doesn't exist
function getUserID(){
    var id = localStorage.getItem(groupID);
    if (!id){
        id = _generateUserID();
        localStorage.setItem(groupID, id);
    }
    return id;
}

//moves indices from local to UTC, handles rollovers
function convertLocalTimesToUTC(times, offset){
    //create UTC converted array
    var timesUTC = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 
    var rolloverArray = Array(Math.abs(offset)).fill(0); 

    if (offset >= 0){
        for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++){
            timesUTC[dayIndex].splice(0, offset, ...rolloverArray);
            rolloverArray.fill(0);

            for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
    
                var offSetIndex = offset + timeIndex;
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
        timesUTC[0].splice(0, offset, ...rolloverArray);
    }

    else{
        for (var dayIndex = 6; dayIndex >= 0; dayIndex--){
            timesUTC[dayIndex].splice(NUMHALFHOURS + offset + 1, Math.abs(offset), ...rolloverArray);
            rolloverArray.fill(0);
    
            for (var timeIndex = 0; timeIndex < NUMHALFHOURS; timeIndex++){
    
                var offSetIndex = offset + timeIndex;
                var value = times[dayIndex][timeIndex];
    
                //check for rollover
                if (offSetIndex < 0){
                    offSetIndex += Math.abs(offset);
                    rolloverArray[offSetIndex] = value
                }
                else{
                    timesUTC[dayIndex][offSetIndex] = value
                }
            }
        }
    
        //Saturday rollover left over
        timesUTC[6].splice(NUMHALFHOURS + offset + 1, Math.abs(offset), ...rolloverArray);
    }
    return timesUTC;
}

//stores received group data after converting it back to local time
function storeReceivedInfo(inputData){
    receivedDBInfo.clear();
    console.log(receivedDBInfo);
    overlapTimes = convertLocalTimesToUTC(inputData[0].overlap, -(userOffsetToUTC));
    for (var userIndex = 1; userIndex < inputData.length; userIndex++){
        receivedDBInfo.set(inputData[userIndex].name, convertLocalTimesToUTC(inputData[userIndex].data, -(userOffsetToUTC)));
    }
}

//creates a random userID
function _generateUserID()
{
    return (Math.floor(Math.random() * 100)).toString();
}
