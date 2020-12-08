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
    }]
});

//use schema for 'lecture' collection schema
const Quiz = mongoose.model('Quiz', QuizSchema);


module.exports = Quiz;