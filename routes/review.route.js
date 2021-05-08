const express = require('express');
const ReviewController = require('../controllers/review.controller');
const Authorization = require('../helpers/authorization')
const router = express.Router();
const Validation = require('../helpers/validation');


router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
ReviewController.getReviewsWithCourseId)

router.post('/',
Authorization.authorize(),
Authorization.authorizeCourseWithReview(),
ReviewController.createReview)

router.put('/reply/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
Authorization.authorizeCourseWithReview(),
ReviewController.replyReview)

router.delete('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
Authorization.authorizeCourseWithReview(),
ReviewController.deleteReview)

module.exports = router