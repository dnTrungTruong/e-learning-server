const express = require('express');
const LectureController = require('../controllers/lecture.controller');
const Authorization = require('../helpers/authorization');
const Role = require('../helpers/role')

const router = express.Router();

router.get('/listbysection/:section_id', LectureController.getLectureList)

router.get('/:id', LectureController.getLectureInfo)

router.post('/:index?',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.createLecture)

router.put('/:id',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.editLecture)

router.delete('/:id',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourseWithLecture(),
LectureController.deleteLecture)

module.exports = router