const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTimesSchema = new Schema({
    groupID: {
        type: String,
        required: true
    },

    userID: {
        type: String,
        required: true
    },

    times: {
        type: [],
        required: true

    },

    name: {
        type: String,
        required: false
    }
});

const Times = mongoose.model('Times', userTimesSchema);
module.exports = Times;