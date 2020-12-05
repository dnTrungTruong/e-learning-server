const express = require('express');
const Authorization = require('../helpers/authorization')
const UserController = require('../controllers/user.controller')
const Validation = require('../helpers/validation');
const Schema = require('../helpers/validationSchemas')
const Role = require('../helpers/role');

const router = express.Router();

router.post('/register',
Validation.validation(Schema.registerSchema),
UserController.create)

router.post('/authenticate', UserController.authenticate)

router.get('/:id',
Authorization.authorize(),
Authorization.authorizeIdentity(),
UserController.getUserInfo)

router.get('/list/student', Authorization.authorize(Role.Admin), UserController.getUserByRole(Role.Student))
router.get('/list/instructor/', Authorization.authorize(Role.Admin), UserController.getUserByRole(Role.Instructor))
router.get('/list/moderator', Authorization.authorize(Role.Admin), UserController.getUserByRole(Role.Moderator))

router.put('/:id', 
Authorization.authorize(), 
Authorization.authorizeIdentity(),
UserController.editInfo)

module.exports = router