const mongoose = require('mongoose');
const NotificationSchema = mongoose.Schema({
    users: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        checked: {
            type: Boolean,
            default: false
        }
    }],
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    target: {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Notification', NotificationSchema);