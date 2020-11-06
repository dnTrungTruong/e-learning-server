const express = require('express');
const router = express.Router();
const userRoute = require('./user.route')
const subjectRoute = require('./subject.route')

//index of routes
router.get('/', function (req, res) {
  res.send('API works!');
});

router.use('/user', userRoute)
router.use('/subject', subjectRoute)

//export router
module.exports = router;
