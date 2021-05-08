const express = require('express');
const QuizController = require('../controllers/quiz.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();


router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
QuizController.getQuiz)

router.post('/submit/:id', 
Validation.areParamsValidObjectIdCasting(),
QuizController.submitQuiz)

router.post('/',
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.createQuiz)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.editQuiz)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
QuizController.deleteQuiz)

module.exports = router