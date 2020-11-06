const express = require('express');
const SubjectController = require('../controllers/subject.controller');

const router = express.Router();

router.get('/', SubjectController.getSubjectList)
router.get('/:id', SubjectController.getSubjectInfo)
router.post('/', SubjectController.createSubject)
router.put('/:id', SubjectController.editSubject)
router.delete('/:id', SubjectController.deleteSubject)

module.exports = router