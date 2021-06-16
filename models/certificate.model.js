const mongoose = require('mongoose');

//define certificate collection schema in MongoDB
const CertificateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    date: {
        type: Date,
        default: Date.now
    },
    finalScore: {
        type: Number,
        default: 0
    },
    url: {
        type: String
    }
});
module.exports = mongoose.model('Certificate', CertificateSchema);