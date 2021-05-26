const express = require('express');
const CourseController = require('../controllers/course.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants');
const router = express.Router();

router.get('/', CourseController.getCourseList)

router.get('/all', 
//Authorization.authorize([Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.getCourseListAll)

router.get('/hot', CourseController.getHotCourses)

router.get('/count-pending-courses', 
Authorization.authorize([Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.getPendingCoursesCount)


router.get('/search/', CourseController.searchCourse)

router.get('/list/:status', 
Authorization.authorize([Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.getCourseListByStatus)

router.get('/:id',
Validation.areParamsValidObjectIdCasting(),
CourseController.getCourseDetails)

router.get('/learning/:id',
Validation.areParamsValidObjectIdCasting(),
// Authorization.authorize(),
// Authorization.authorizeEnrolledCourse(),
CourseController.getCourseLearningDetails)

router.post('/',
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.createCourse)

router.put('/submit/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
Authorization.authorizeCreatedCourse(),
CourseController.submitCourseForApproval)

router.put('/approve/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.approveCourse)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourse(),
CourseController.editCourse)

router.put('/tags/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
CourseController.editCourseTags)

router.delete('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourse(),
CourseController.deleteCourse)

module.exports = router