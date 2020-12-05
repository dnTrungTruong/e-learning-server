const express = require('express');
const FileController = require('../controllers/file.controller');
const Authorization = require('../helpers/authorization');
const Role = require('../helpers/role');

const router = express.Router();

router.get('/listbysection/:section_id', FileController.getListFiles)

router.get('/:section_id/:name',
Authorization.authorize(),
Authorization.authorizeCourseWithFile(),
FileController.download)

router.post('/:section_id',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCourseWithFile(),
FileController.upload)

//router.put('/:id', FileController.editResources)

router.delete('/:section_id/:name',
Authorization.authorize([Role.Instructor, Role.Moderator, Role.Admin]),
Authorization.authorizeCourseWithFile(),
FileController.delete)

module.exports = router