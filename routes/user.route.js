const express = require('express');
const passport = require('passport');
const Authorization = require('../helpers/authorization')
const UserController = require('../controllers/user.controller')
const Validation = require('../helpers/validation');
const Schema = require('../helpers/validationSchemas')
const Constants = require('../helpers/constants');

const router = express.Router();


router.post('/register',
Validation.validation(Schema.registerSchema),
UserController.create)

router.post('/authenticate', UserController.authenticate)

router.put('/enroll/:id', //provide courseId here
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
UserController.enrollCourse)

router.post('/password-reset/send', UserController.sendSecretCode)

router.post('/password-reset/verify', UserController.verifySecretCode)

router.get('/list/student', Authorization.authorize(Constants.USER_ROLES.ADMIN), UserController.getUserByRole(Constants.USER_ROLES.STUDENT))
router.get('/list/instructor/', Authorization.authorize(Constants.USER_ROLES.ADMIN), UserController.getUserByRole(Constants.USER_ROLES.INSTRUCTOR))
router.get('/list/moderator', Authorization.authorize(Constants.USER_ROLES.ADMIN), UserController.getUserByRole(Constants.USER_ROLES.MODERATOR))

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/failed', (req, res) => res.status(200).json({message: "Failed to login with Google."}))

router.get('/auth/facebook/failed', (req, res) => res.status(200).json({message: "Failed to login with Facebook."}))


router.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/api/user/auth/google/failed', session: false }), 
UserController.authenticateWithPassport)


router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

router.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/api/user/auth/facebook/failed', session: false }), 
UserController.authenticateWithPassport)

router.get('/userinfo-with-jwt',
Authorization.authorize(),
UserController.getUserInfoJWT)

router.get('/my-enrolled-courses',
Authorization.authorize(),
UserController.getMyEnrolledCourses)

router.get('/test-mail-api',
UserController.sendTestMail)

router.get('/:id',
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
Authorization.authorizeIdentity(),
UserController.getUserInfo)



router.get('/verification/send/',
Authorization.authorize(),
UserController.sendVerifyMail)

router.get('/verification/verify/:userId/:secretCode', UserController.verifyMail)

router.put('/change-password/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(), 
Authorization.authorizeIdentity(),
UserController.changePassword)

router.put('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(), 
Authorization.authorizeIdentity(),
UserController.editInfo)



module.exports = router