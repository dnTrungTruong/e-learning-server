const express = require('express');
const CertificateController = require('../controllers/certificate.controller');
const Authorization = require('../helpers/authorization');
const Validation = require('../helpers/validation');
const Constants = require('../helpers/constants')

const router = express.Router();

router.get('/:id', 
Validation.areParamsValidObjectIdCasting(),
Authorization.authorize(),
CertificateController.getCertificate)


router.post('/', 
Authorization.authorize(),
CertificateController.createCertificate)

module.exports = router