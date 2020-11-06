const express = require('express');
const router = express.Router();
const userRoute = require('./user.route')

//index of routes
router.get('/', function (req, res) {
  res.send('API works!');
});

router.use('/user', userRoute)

//export router
module.exports = router;
