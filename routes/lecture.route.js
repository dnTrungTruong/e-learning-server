const express = require('express');
const LectureController = require('../controllers/lecture.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();

router.get('/listbysection/:id', 
Validation.areParamsValidObjectIdCasting(),
LectureController.getLectureList)

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
LectureController.getLectureInfo)

router.post('/:index?',
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.createLecture)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.editLecture)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.deleteLecture)

module.exports = router