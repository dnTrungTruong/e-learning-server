const express = require('express');
const CourseController = require('../controllers/course.controller');
const Authorization = require('../helpers/authorization');
const Role = require('../helpers/role');
const router = express.Router();

router.get('/', CourseController.getCourseList)

router.get('/search/:keyword', CourseController.searchCourse)

router.get('/:id', CourseController.getCourseDetails)

router.post('/',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
CourseController.createCourse)

router.put('/:id',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourse(),
CourseController.editCourse)

router.delete('/:id', 
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourse(),
CourseController.deleteCourse)

module.exports = router