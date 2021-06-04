const express = require('express');
const Authorization = require('../helpers/authorization')
const router = express.Router();
const Validation = require('../helpers/validation');
const WebhookController = require('../controllers/webhook.controller')

router.post('/chatbot',
WebhookController.chatbotWebhookCall)

module.exports = router