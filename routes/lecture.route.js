const express = require('express');
const LectureController = require('../controllers/lecture.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Role = require('../helpers/role')

const router = express.Router();

router.get('/listbysection/:id', 
Validation.areParamsValidObjectIdCasting(),
LectureController.getLectureList)

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
LectureController.getLectureInfo)

router.post('/:index?',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.createLecture)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.editLecture)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.deleteLecture)

module.exports = router