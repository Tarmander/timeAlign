//load environment variables
require('dotenv').config({path: require('find-config')('.env')});
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
    var result = Array(7).fill().map(() => Array(48).fill(1)); 
    for (var user = 0; user < userInfo.length; user++){
        for (var dayIdx = 0; dayIdx < 7; dayIdx++){
            for (var timeIdx = 0; timeIdx < 48; timeIdx++){
                result[dayIdx][timeIdx] &= userInfo[user].data[dayIdx][timeIdx];
            }
        }
    }
    return result;
}

module.exports.connectToDB = connectToDB;
module.exports.save = save;
module.exports.grabGroupInfo = grabGroupInfo;
module.exports.getOverlap = getOverlap;


