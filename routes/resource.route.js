const express = require('express');
const ResourceController = require('../controllers/resource.controller');

const router = express.Router();

router.get('/list/lecture/:id', ResourceController.getResourceList)
router.get('/:id', ResourceController.getResourceInfo)
router.post('/:index?', ResourceController.createResource)
router.put('/:id', ResourceController.editResources)
router.delete('/:id', ResourceController.deleteResource)

module.exports = router