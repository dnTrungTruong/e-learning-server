const express = require('express');
const CourseController = require('../controllers/course.controller');

const router = express.Router();

router.get('/', CourseController.getCourseList)
router.get('/:id', CourseController.getCourseDetails)
router.post('/', CourseController.createCourse)
router.put('/:id', CourseController.editCourse)
router.delete('/:id', CourseController.deleteCourse)

module.exports = router