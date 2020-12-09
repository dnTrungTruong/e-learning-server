const mongoose = require('mongoose');

const SecretCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600, // 60*10 = 10min
    },
});

const SecretCode = mongoose.model('SecretCode', SecretCodeSchema);

module.exports = SecretCode;