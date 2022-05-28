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

//
async function save(userObject){
    const filter = {groupID: userObject.groupID, userID: userObject.userID}
    Times.findOne(filter, function(err, times){
        if(!err) {
            if(!times) {
                times = new Times({
                    groupID: userObject.groupID,
                    userID: userObject.userID,
                    data: userObject.data,
                    name: userObject.name
                })
            }
            times.times = userObject.data;
            times.save(function(err){
                if(!err) {
                    console.log("Data stored");
                }
                else {
                    console.log("Data store failed");
                }
            });
        }
    });
}

async function grabGroupInformation(userObject){
    filter = {groupID: userObject.groupID};
    data = [];
    const results = await Times.find(filter, 'data name -_id');
    results.map(result => data.push(result.data));
    return data;
}

module.exports.connectToDB = connectToDB;
module.exports.save = save;
module.exports.grabGroupInfo = grabGroupInformation;


