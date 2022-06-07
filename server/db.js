//load environment variables
require('dotenv').config();
const mongoose = require('mongoose');
const CONNECTION_URL = process.env.DB_URL;
const Times = require('./models/times');

function connectToDB(){
    mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.once('open', () => console.log('Connected to Database'))
}

//saves the POSTed data into the mongodb document associated with the group
async function save(userObject){
    const filter = {groupID: userObject.groupID, userID: userObject.userID};
    console.log(userObject);
    times = await Times.findOne(filter).exec();
    if(!times) {
        times = new Times({
        groupID: userObject.groupID,
        userID: userObject.userID,
        data: userObject.data,
        name: userObject.name
        });
    }
    times.data = userObject.data;
    times.name = userObject.name;
    return times.save();
}

async function grabGroupInfo(id){
    filter = {groupID: id};
    const results = await Times.find(filter);
    return results;
}

//takes JSON representation of user's times and returns overlapping times in 2D array
//TODO: optimize this abomination
function getOverlap(userInfo){
    if (userInfo.length == 0){
        throw "No data";
    }
    var result = userInfo[0].data;
    for (var user = 1; user < userInfo.length; user++){
        for (var dayIndex = 0; dayIndex < 7; dayIndex++){
            for (var timeIndex = 0; timeIndex < 48; timeIndex++){
                result[dayIndex][timeIndex] &= userInfo[user].data[dayIndex][timeIndex];
            }
        }
    }
    return result;
}

module.exports.connectToDB = connectToDB;
module.exports.save = save;
module.exports.grabGroupInfo = grabGroupInfo;
module.exports.getOverlap = getOverlap;


