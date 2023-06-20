const mongoose = require('mongoose');

// Database schema that stores the tokens generated by jwt
const accessTokensSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('accessTokensDB', accessTokensSchema);