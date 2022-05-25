//load environment variables
require('dotenv').config();
const mongoose = require('mongoose');
const CONNECTION_URL = process.env.DB_URL;
const times = require('./models/times');

function connectToDB(){
    mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.once('open', () => console.log('Connected to Database'))
}

function save(userObject){
    const time = new times({
        groupID: userObject['groupID'],
        userID: userObject['userID'],
        times: userObject['data'],
        name: 'Kevin'
    })
    time.save();
}

module.exports.connectToDB = connectToDB;
module.exports.save = save;
