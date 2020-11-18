const express = require('express');
const router = express.Router();
const userRoute = require('./user.route')
const subjectRoute = require('./subject.route')
const courseRoute = require('./course.route')
const sectionRoute = require('./section.route')
const lectureRoute = require('./lecture.route')
const resourceRoute = require('./resource.route')
const fileRoute = require('./file.route')

//index of routes
router.get('/', function (req, res) {
  res.send('API works!');
});

router.use('/user', userRoute)
router.use('/subject', subjectRoute)
router.use('/course', courseRoute)
router.use('/section', sectionRoute)
router.use('/lecture', lectureRoute)
//router.use('/resource', resourceRoute) No need at the moment
router.use('/file', fileRoute)

//export router
module.exports = router;
