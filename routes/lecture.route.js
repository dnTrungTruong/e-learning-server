const express = require('express');
const LectureController = require('../controllers/lecture.controller');

const router = express.Router();

router.get('/list/section/:id', LectureController.getLectureList)
router.get('/:id', LectureController.getLectureInfo)
router.post('/:index?', LectureController.createLecture)
router.put('/:id', LectureController.editLecture)
router.delete('/:id', LectureController.deleteLecture)

module.exports = router