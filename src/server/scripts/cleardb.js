require('dotenv').config();
const mongoose = require('mongoose');
const CONNECTION_URL = process.env.DB_URL;
const Times = require('../models/times');

async function clearDB(){
    mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    const db = mongoose.connection
    db.once('open', () => console.log('Connected to Database before clear'));
    await Times.deleteMany();
    db.close();
}

clearDB();