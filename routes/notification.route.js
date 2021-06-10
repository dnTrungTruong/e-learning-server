const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const Authorization = require('../helpers/authorization')
const router = express.Router();
const Validation = require('../helpers/validation');

router.get('/', 
Authorization.authorize(),
NotificationController.getNotifications)

router.put('/check/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
NotificationController.checkNotification)

module.exports = router