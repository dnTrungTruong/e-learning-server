const express = require('express');
const router = express.Router();
const userRoute = require('./user.route')
const subjectRoute = require('./subject.route')
const courseRoute = require('./course.route')
const sectionRoute = require('./section.route')
const lectureRoute = require('./lecture.route')
const quizRoute = require('./quiz.route')
const fileRoute = require('./file.route')
const reviewRoute = require('./review.route')
const announcementRoute = require('./announcement.route')
const notificationRoute = require('./notification.route')
const resourceRoute = require('./resource.route')
const webhookRoute = require('./webhook.route')
const attempRoute = require('./attempt.route')
const certificateRoute = require('./certificate.route')

//index of routes
router.get('/', function (req, res) {
  res.send('API works!');
});

router.use('/user', userRoute)
router.use('/subject', subjectRoute)
router.use('/course', courseRoute)
router.use('/section', sectionRoute)
router.use('/lecture', lectureRoute)
router.use('/quiz', quizRoute)
router.use('/file', fileRoute)
router.use('/review', reviewRoute)
router.use('/announcement', announcementRoute)
router.use('/notification', notificationRoute)
router.use('/resource', resourceRoute)
router.use('/webhook', webhookRoute)
router.use('/attempt', attempRoute)
router.use('/certificate', certificateRoute)

//export router
module.exports = router;
