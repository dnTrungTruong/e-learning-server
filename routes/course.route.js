const express = require('express');
const CourseController = require('../controllers/course.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Role = require('../helpers/role');
const router = express.Router();

router.get('/', CourseController.getCourseList)

router.get('/hot', CourseController.getHotCourses)

router.get('/search/', CourseController.searchCourse)

router.get('/list/:status', 
Authorization.authorize([Role.Moderator, Role.Admin]),
CourseController.getCourseListByStatus)

router.get('/:id',
Validation.areParamsValidObjectIdCasting(),
CourseController.getCourseDetails)

router.post('/',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
CourseController.createCourse)

router.put('/submit/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
Authorization.authorizeCreatedCourse(),
CourseController.submitCourseForApproval)

router.put('/approve/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Role.Moderator, Role.Admin]),
CourseController.approveCourse)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourse(),
CourseController.editCourse)

router.delete('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCreatedCourse(),
CourseController.deleteCourse)

module.exports = router