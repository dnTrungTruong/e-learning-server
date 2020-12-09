const nodemailer = require("nodemailer");
const config = require('../config.json')


const emailService = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PW,
    },
});

module.exports = emailService;