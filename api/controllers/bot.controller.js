const botService = require('../services/bot.service');

/**
 * Register user for WhatsApp bot
 * POST /api/bot/register
 * Body: { preferred_time: '21:00' | '21:30' | '22:00' }
 */
exports.registerForBot = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { preferred_time } = req.body;
        const phone = req.user.phone;

        if (!['21:00', '21:30', '22:00'].includes(preferred_time)) {
            return res.status(400).json({
                error: 'Invalid preferred_time. Choose from: 21:00, 21:30, 22:00',
            });
        }

        const botUser = await botService.registerBotUser(userId, phone, preferred_time);

        res.status(201).json({
            message: 'Registered for Raat Ka Hisaab bot!',
            botUser: {
                _id: botUser._id,
                phone: botUser.phone,
                preferred_time: botUser.preferred_time,
                streak: botUser.streak,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle incoming WhatsApp webhook message
 * POST /api/bot/webhook
 * Meta WhatsApp webhook payload
 */
exports.handleWebhook = async (req, res, next) => {
    try {
        const { entry } = req.body;

        if (!entry || !entry[0]) {
            return res.status(200).json({ received: true });
        }

        const changes = entry[0].changes[0];
        const messages = changes?.value?.messages;
        const contacts = changes?.value?.contacts;

        if (!messages || messages.length === 0) {
            return res.status(200).json({ received: true });
        }

        // Process each message
        for (const message of messages) {
            const phoneNumber = message.from; // Sender's phone number
            const messageText = message.text?.body || '';

            if (!messageText) continue;

            // Handle the message
            const result = await botService.handleWebhookMessage(phoneNumber, messageText);

            // Log for debugging
            console.log(`Bot message from ${phoneNumber}: "${messageText}"`, result);

            // Send response back via WhatsApp (if using WhatsApp API client)
            // You'd call sendWhatsAppMessage(phoneNumber, result.message) here
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        // Always return 200 to prevent WhatsApp from retrying
        res.status(200).json({ received: true, error: error.message });
    }
};

/**
 * WhatsApp webhook verification (GET request from Meta)
 * GET /api/bot/webhook
 */
exports.verifyWebhook = (req, res) => {
    const challenge = req.query['hub.challenge'];
    const token = req.query['hub.verify_token'];
    const webhookToken = process.env.WHATSAPP_WEBHOOK_TOKEN || 'ecosaathi_bot_secret_2024';

    if (token !== webhookToken) {
        return res.status(403).json({ error: 'Invalid webhook token' });
    }

    res.status(200).send(challenge);
};

/**
 * Get bot status for current user
 * GET /api/bot/status
 */
exports.getBotStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const botUser = await botService.getBotUser(userId);

        if (!botUser) {
            return res.status(404).json({
                registered: false,
                message: 'Not registered for bot yet',
            });
        }

        res.status(200).json({
            registered: true,
            botUser: {
                phone: botUser.userId.phone,
                preferred_time: botUser.preferred_time,
                streak: botUser.streak,
                last_answered: botUser.last_answered,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get 30-day insights
 * GET /api/bot/insights
 */
exports.getInsights = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const insights = await botService.generateInsights(userId);

        res.status(200).json(insights);
    } catch (error) {
        next(error);
    }
};

/**
 * Update bot preferences
 * PATCH /api/bot/preferences
 * Body: { preferred_time: '21:00' }
 */
exports.updatePreferences = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { preferred_time } = req.body;

        if (!['21:00', '21:30', '22:00'].includes(preferred_time)) {
            return res.status(400).json({
                error: 'Invalid preferred_time. Choose from: 21:00, 21:30, 22:00',
            });
        }

        const botUser = await botService.updateBotUserPreferences(userId, preferred_time);

        res.status(200).json({
            message: 'Preferences updated',
            botUser: {
                preferred_time: botUser.preferred_time,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get today's 3 questions for the logged-in user
 * GET /api/bot/today
 */
exports.getTodayQuestionsHandler = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const data = await botService.getTodayQuestions(userId);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

/**
 * Submit answers for today's questions (in-app)
 * POST /api/bot/answer
 * Body: { question_ids: string[], answers: ('Y'|'N'|'Hmm')[] }
 */
exports.submitAnswerHandler = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { question_ids, answers } = req.body;

        if (!question_ids || !answers || question_ids.length !== answers.length) {
            return res.status(400).json({ error: 'question_ids and answers arrays required and must match in length' });
        }

        const validAnswers = ['Y', 'N', 'Hmm'];
        for (const a of answers) {
            if (!validAnswers.includes(a)) {
                return res.status(400).json({ error: `Invalid answer "${a}". Must be Y, N, or Hmm` });
            }
        }

        const result = await botService.submitInAppAnswer(userId, question_ids, answers);

        if (result.alreadyAnswered) {
            return res.status(409).json({ error: 'Already answered today. Come back tomorrow!' });
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
