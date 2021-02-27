const express = require('express');
const SectionController = require('../controllers/section.controller');
const Authorization = require('../helpers/authorization')
const Validation = require('../helpers/validation');
const router = express.Router();

router.get('/listbycourse/:course_id', SectionController.getSectionList)

router.get('/:id', 
Validation.isParamsValidObjectIdCasting(),
SectionController.getSectionInfo)

router.post('/:index?', 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.createSection)

router.put('/:id',
Validation.isParamsValidObjectIdCasting(), 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.editSection)

router.delete('/:id',
Validation.isParamsValidObjectIdCasting(), 
Authorization.authorize(),
Authorization.authorizeCreatedCourseWithSection(), 
SectionController.deleteSection)

module.exports = router