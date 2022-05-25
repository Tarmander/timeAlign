const groupID = grabIDFromURL();
const userID = generateUserID();
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
    console.log(times);
    //create UTC converted array
    var userTimesUTC = Array(NUMDAYS).fill().map(() => Array(NUMHALFHOURS).fill(0)); 
    //Maximum time difference possible is 26 hours, so max rollver of 26
    const userOffsetToUTC = (new Date().getTimezoneOffset() / 60) * 2; // Offset from UTC time in half hours
    var rolloverArray = Array(ROLLOVERLEN).fill(0); 
    
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++){
        userTimesUTC[dayIndex].splice(0, 1, rolloverArray);
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
                userTimesUTC[dayIndex][offSetIndex] = value
            }
        }
    }

    //Sunday rollover left over
    userTimesUTC[0].splice(0, 1, rolloverArray);
    //console.log(userTimesUTC);
    return userTimesUTC;
}

function  convertTimesToInt(userTimesUTC){
    var result = []
    for (var dayIndex = 0; dayIndex < NUMDAYS; dayIndex++) {
        var newNum = userTimesUTC[dayIndex][0];

        for (var timeIndex = 1; timeIndex < NUMHALFHOURS; timeIndex++){
            newNum = (newNum << 1) || userTimesUTC[dayIndex][timeIndex];
        }
        result.push(newNum)
    }

    return result;
}

function sendTimesToServer(times){
    const data = {"groupID": groupID, "userID": userID, "data": convertTimesToInt(convertLocalTimesToUTC(times))};
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    //console.log(data);
    fetch('http://localhost:3000/api', options);
}