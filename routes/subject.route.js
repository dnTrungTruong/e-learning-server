const express = require('express');
const SubjectController = require('../controllers/subject.controller');
const Authorization = require('../helpers/authorization')
const Constants = require('../helpers/constants')
const router = express.Router();
const Validation = require('../helpers/validation');

router.get('/', SubjectController.getSubjectList)

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
SubjectController.getSubjectInfo)

router.post('/',
Authorization.authorize(Constants.USER_ROLES.ADMIN),
SubjectController.createSubject)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(Constants.USER_ROLES.ADMIN),
SubjectController.editSubject)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(Constants.USER_ROLES.ADMIN),
SubjectController.deleteSubject)

module.exports = router