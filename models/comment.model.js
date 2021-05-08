const mongoose = require('mongoose');

//define comment collection schema in MongoDB
const CommentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    replies: [{
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
    }],
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Comment', CommentSchema);