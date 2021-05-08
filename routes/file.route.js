const express = require('express');
const FileController = require('../controllers/file.controller');
const Authorization = require('../helpers/authorization');
const Constans = require('../helpers/constants');

const multer = require('multer');

var upload = multer();

const router = express.Router();

router.get('/listbysection/:section_id', FileController.getListFiles)

router.get('/presignedurl/:course_id', FileController.uploadVideo)

router.get('/s3/:course_id/:filename',
//Authorization.authorize(),
//Authorization.authorizeCourseWithFile(),
FileController.download)

router.post('/image/',
FileController.uploadImage)


router.post('/:section_id',
//Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
//Authorization.authorizeCourseWithFile(),
FileController.uploadDoc)

router.post('/s3/:section_id', FileController.upload)

//router.put('/:id', FileController.editResources)
//router.delete('/image/', FileController.deleteImage) //must provide public_id in body because of [DELETE] /image/course_img/public_id not work

// router.delete('/:section_id/:name',
// Authorization.authorize([Constants.USER_ROLES.INSTRUCTOR, Constants.USER_ROLES.MODERATOR, Constants.USER_ROLES.ADMIN]),
// Authorization.authorizeCourseWithFile(),
// FileController.delete)

module.exports = router