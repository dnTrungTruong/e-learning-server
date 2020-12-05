const express = require('express');
const Authorization = require('../helpers/authorization')
const UserController = require('../controllers/user.controller')
const Role = require('../helpers/role');

const router = express.Router();

router.post('/register', UserController.create)
router.post('/authenticate', UserController.authenticate)
router.get('/:id',
Authorization.authorize(),
Authorization.authorizeIdentity(),
UserController.getUserInfo)

router.get('/list/student', Authorization.authorize(Role.Admin), UserController.getStudentList)
router.get('/list/instructor/', Authorization.authorize(Role.Admin), UserController.getInstructorList)
router.get('/list/moderator', Authorization.authorize(Role.Admin), UserController.getModeratorList)

router.put('/:id', 
Authorization.authorize(), 
Authorization.authorizeIdentity(),
UserController.editInfo)

module.exports = router