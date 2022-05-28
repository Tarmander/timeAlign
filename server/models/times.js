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

    data: {
        type: [],
        required: true

    },

    name: {
        type: String,
        required: false
    }
});

//userTimesSchema.index({groupdID: 1, userID: 1}, { unique: true})
const Times = mongoose.model('times', userTimesSchema);
module.exports = Times;