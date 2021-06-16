const express = require('express');
const AttemptController = require('../controllers/attempt.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();


router.get('/attempt-by-quiz/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AttemptController.getAttemptByQuiz)

router.get('/:id', //courseId
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AttemptController.getAttempt)


router.post('/', //courseId
Authorization.authorize(),
AttemptController.createAttempt)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
Authorization.authorize(),
AttemptController.putNewAttempt)

router.put('/update/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
Authorization.authorize(),
AttemptController.updateUserAnswers)

router.put('/submit/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCreatedCourseWithLecture(),
Authorization.authorize(),
AttemptController.submitAttempt)


module.exports = router