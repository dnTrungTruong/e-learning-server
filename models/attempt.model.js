const mongoose = require('mongoose');

//define attempt collection schema in MongoDB
const AttemptSchema = mongoose.Schema({
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
    quizzes: [{
        _id: false,
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        attempts: [{
            _id: false,
            score: {
                type: Number,
                default: 0
            },
            correctAnswers: {
                type: Number,
                default: 0
            },
            questions: [{
                question: {
                    type: String
                },
                answers: [{
                    type: String
                }],
                userAnswer: {
                    type: String
                }
            }],
            attemptDate: {
                type: Date,
                default: Date.now
            },
            attemptEndTime: {
                type: Date
            },
            attemptSubmittedTime: {
                type: Date
            }
        }],
        highestScore: {
            type: Number,
            default: 0
        },
        isPassed: {
            type: Boolean,
            default: false
        }
    }],
    certificate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate'
    }
});
module.exports = mongoose.model('Attempt', AttemptSchema);