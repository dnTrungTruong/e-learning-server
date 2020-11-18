const express = require('express');
const FileController = require('../controllers/file.controller');

const router = express.Router();

router.get('/list-by-section/:section_id', FileController.getListFiles)
router.get('/:section_id/:name', FileController.download)
router.post('/:section_id', FileController.upload)
//router.put('/:id', FileController.editResources)
router.delete('/:section_id/:name', FileController.delete)

module.exports = router