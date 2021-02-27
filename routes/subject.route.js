const express = require('express');
const SubjectController = require('../controllers/subject.controller');
const Authorization = require('../helpers/authorization')
const Role = require('../helpers/role')
const router = express.Router();
const Validation = require('../helpers/validation');

router.get('/', SubjectController.getSubjectList)

router.get('/:id', 
Validation.isParamsValidObjectIdCasting(),
SubjectController.getSubjectInfo)

router.post('/',
Authorization.authorize(Role.Admin),
SubjectController.createSubject)

router.put('/:id',
Validation.isParamsValidObjectIdCasting(),
Authorization.authorize(Role.Admin),
SubjectController.editSubject)

router.delete('/:id',
Validation.isParamsValidObjectIdCasting(),
Authorization.authorize(Role.Admin),
SubjectController.deleteSubject)

module.exports = router