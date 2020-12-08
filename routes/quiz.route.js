const express = require('express');
const QuizController = require('../controllers/quiz.controller');
const Authorization = require('../helpers/authorization');
const Role = require('../helpers/role')

const router = express.Router();


router.get('/:id', QuizController.getQuiz)

router.post('/submit/:id', QuizController.submitQuiz)

router.post('/',
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.createQuiz)

router.put('/:id',
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.editQuiz)

router.delete('/:id',
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.deleteQuiz)

module.exports = router