const express = require('express');
const ResourceController = require('../controllers/resource.controller');
const Validation = require('../helpers/validation');
const Authorization = require('../helpers/authorization');
const Constants = require('../helpers/constants');

const router = express.Router();

router.get('/:id', //lecture_id
Validation.areParamsValidObjectIdCasting(),
ResourceController.getResourcesByLecture)
// router.get('/:id', ResourceController.getResourceInfo)
router.post('/:index?', 
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithResource(),
ResourceController.createResource)
router.put('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithResource(),
ResourceController.editResources)
router.delete('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
Authorization.authorizeCreatedCourseWithResource(),
ResourceController.deleteResource)

module.exports = router 