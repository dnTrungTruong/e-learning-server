const mongoose = require('mongoose');

//define quiz collection schema in MongoDB
const QuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    questions: [{
        question: {
            type: String
        },
        answers: [{
            type: String
        }],
        correctAnswer: {
            type: String
        }
    }],
    limitTime: {
        type: Number,
        require: true
    },
    isFinal: {
        type: Boolean,
        default: false
    }
});

//use schema for 'quiz' collection schema
const Quiz = mongoose.model('Quiz', QuizSchema);


module.exports = Quiz;