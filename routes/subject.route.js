const express = require('express');
const SubjectController = require('../controllers/subject.controller');
const Authorization = require('../helpers/authorization')
const Role = require('../helpers/role')
const router = express.Router();

router.get('/', SubjectController.getSubjectList)
router.get('/:id', SubjectController.getSubjectInfo)
router.post('/', Authorization.authorize(Role.Admin), SubjectController.createSubject)
router.put('/:id', Authorization.authorize(Role.Admin), SubjectController.editSubject)
router.delete('/:id', Authorization.authorize(Role.Admin), SubjectController.deleteSubject)

module.exports = router