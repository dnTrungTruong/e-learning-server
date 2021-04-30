const mongoose = require('mongoose');

//define review collection schema in MongoDB
const ReviewSchema = mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rate: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    reply: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String
        },
        date: {
            type: Date
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Reviews', ReviewSchema);