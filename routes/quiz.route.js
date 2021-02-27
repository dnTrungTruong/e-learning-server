const express = require('express');
const QuizController = require('../controllers/quiz.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Role = require('../helpers/role')

const router = express.Router();


router.get('/:id', 
Validation.isParamsValidObjectIdCasting(),
QuizController.getQuiz)

router.post('/submit/:id', 
Validation.isParamsValidObjectIdCasting(),
QuizController.submitQuiz)

router.post('/',
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.createQuiz)

router.put('/:id',
Validation.isParamsValidObjectIdCasting(),
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.editQuiz)

router.delete('/:id',
Validation.isParamsValidObjectIdCasting(),
// Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.deleteQuiz)

module.exports = router