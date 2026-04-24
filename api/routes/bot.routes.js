const express = require('express');
const {
    registerForBot,
    handleWebhook,
    verifyWebhook,
    getBotStatus,
    getTodayQuestionsHandler,
    submitAnswerHandler,
} = require('../controllers/bot.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Webhook verification and message handling (public endpoint)
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

// In-app daily questions
router.get('/today', protect, getTodayQuestionsHandler);
router.post('/answer', protect, submitAnswerHandler);

// Protected endpoints (require authentication)
router.post('/register', protect, registerForBot);
router.get('/status', protect, getBotStatus);

module.exports = router;
