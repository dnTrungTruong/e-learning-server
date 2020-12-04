const express = require('express');
const SectionController = require('../controllers/section.controller');
const Authorization = require('../helpers/authorization')
const router = express.Router();

router.get('/listbycourse/:course_id', SectionController.getSectionList)

router.get('/:id', SectionController.getSectionInfo)

router.post('/:index?', 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.createSection)

router.put('/:id', 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.editSection)

router.delete('/:id', 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.deleteSection)

module.exports = router