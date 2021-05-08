const mongoose = require('mongoose');

//define announcement collection schema in MongoDB
const AnnouncementSchema = mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
module.exports = mongoose.model('Announcement', AnnouncementSchema);