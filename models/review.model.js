const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

//define review collection schema in MongoDB
const ReviewSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
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

ReviewSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Reviews', ReviewSchema);