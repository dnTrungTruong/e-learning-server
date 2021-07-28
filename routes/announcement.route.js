const express = require('express');
const AnnouncementController = require('../controllers/announcement.controller');
const Authorization = require('../helpers/authorization')
const router = express.Router();
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')


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
Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
AnnouncementController.createAnnouncement)

router.put('/comment/reply/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.replyComment)

router.put('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.editAnnouncement)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
AnnouncementController.deleteAnnouncement)

module.exports = router