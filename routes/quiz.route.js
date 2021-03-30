const express = require('express');
const QuizController = require('../controllers/quiz.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Role = require('../helpers/role')

const router = express.Router();


router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
QuizController.getQuiz)

router.post('/submit/:id', 
Validation.areParamsValidObjectIdCasting(),
QuizController.submitQuiz)

router.post('/',
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.createQuiz)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.editQuiz)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.deleteQuiz)

module.exports = router