const express = require('express');
const SectionController = require('../controllers/section.controller');

const router = express.Router();

router.get('/list/course/:id', SectionController.getSectionList)
router.get('/:id', SectionController.getSectionInfo)
router.post('/', SectionController.createSection)
router.put('/:id', SectionController.editSection)
router.delete('/:id', SectionController.deleteSection)

module.exports = router