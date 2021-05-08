const express = require('express');
const AnnouncementController = require('../controllers/announcement.controller');
const Authorization = require('../helpers/authorization')
const router = express.Router();
const Validation = require('../helpers/validation');


// router.get('/comment/:id', //announcementId
// Validation.areParamsValidObjectIdCasting(),
// AnnouncementController.getCommentsWithAnnouncementId)

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
AnnouncementController.getAnnouncementsWithCourseId)

router.post('/comment/:id', //announcementId
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.postComment)

router.post('/',
Authorization.authorize(),
AnnouncementController.createAnnouncement)

router.put('/comment/reply/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.replyComment)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.deleteAnnouncement)

module.exports = router