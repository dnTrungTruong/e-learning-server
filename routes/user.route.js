const express = require('express');
const authorize = require('../helpers/authorize')
const UserController = require('../controllers/user.controller')
const Role = require('../helpers/role');

const router = express.Router();

router.post('/register', UserController.create)
router.post('/authenticate', UserController.authenticate)
router.get('/:id', authorize(), UserController.getUserInfo)

router.get('/list/student', authorize(Role.Admin), UserController.getStudentList)
router.get('/list/instructor', authorize(Role.Admin), UserController.getInstructorList)
router.get('/list/moderator', authorize(Role.Admin), UserController.getModeratorList)

router.put('/:id', authorize(), UserController.editInfo)
module.exports = router