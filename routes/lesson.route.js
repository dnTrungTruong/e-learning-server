const express = require('express');
const LessonController = require('../controllers/lesson.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();

router.get('/listbysection/:id', 
Validation.areParamsValidObjectIdCasting(),
LessonController.getLessonList)

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
LessonController.getLessonInfo)

router.post('/:index?',
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLesson(),
LessonController.createLesson)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLesson(),
LessonController.editLesson)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLesson(),
LessonController.deleteLesson)

module.exports = router