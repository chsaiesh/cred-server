const mongoose = require('mongoose');

// Database schema to store user data in the MongoDB
const employeeFeedbackSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    employeeID: {
        type: Number,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    taggedRepotees: {
        type: Array
    },
    feedbackReceived: [{
        fromEmployee: {
            type: Number
        },
        receivedFeedback: {
            type: String
        }
    }],
    feedbackGiven: [{
        toEmployee: {
            type: Number
        },
        givenFeedback: {
            type: String
        }
    }]
});

module.exports = mongoose.model('userDB', employeeFeedbackSchema);