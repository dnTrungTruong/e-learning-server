const express = require('express');
const UserProgressController = require('../controllers/userProgress.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();


router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
UserProgressController.getUserProgress)

router.post('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
UserProgressController.createUserProgress)

router.post('/update-current-lesson/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
UserProgressController.updateCurrentLesson)

module.exports = router