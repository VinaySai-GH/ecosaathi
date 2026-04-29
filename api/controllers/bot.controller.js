const botService       = require('../services/bot.service');
const whatsappService  = require('../services/whatsapp.service');
const insightsService  = require('../services/insights.service');
const { getDailyQuote } = require('../data/quotes');

// Helper to get dynamic base URL from request (for clickable links in WhatsApp)
function getBaseUrl(req) {
    if (process.env.WEBAPP_URL) return process.env.WEBAPP_URL;
    // Fallback to detecting from request headers (useful for ngrok/localtunnel)
    const host = req.get('host');
    const protocol = req.protocol;
    return `${protocol}://${host}`;
}

/**
 * Parse a reply like "YNY", "Y N H", "y,n,hmm" -> ['Y','N','Hmm']
 */
function parseMultiAnswer(text) {
    const raw = text.trim().toUpperCase().replace(/[,|\s]+/g, '');
    const MAP = { 'Y': 'Y', 'N': 'N', 'H': 'Hmm', 'HMM': 'Hmm' };

    // Try full-word tokens first (e.g. "Y N HMM")
    const tokens = text.trim().toUpperCase().split(/[,|\s]+/);
    if (tokens.length === 3 && tokens.every(t => ['Y','N','HMM','H'].includes(t))) {
        return tokens.map(t => MAP[t]);
    }

    // Try compact 3-char (e.g. "YNY")
    if (raw.length === 3 && [...raw].every(c => ['Y','N','H'].includes(c))) {
        return [...raw].map(c => MAP[c]);
    }

    return null;
}

/**
 * Register user for WhatsApp bot
 * POST /api/bot/register
 */
exports.registerForBot = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { preferred_time } = req.body;
        const phone = req.user.phone;

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (preferred_time !== 'Off' && !timeRegex.test(preferred_time)) {
            return res.status(400).json({
                error: 'Invalid preferred_time. Choose a valid 24-hour time like 21:30, or Off',
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
 */
exports.handleWebhook = async (req, res) => {
    try {
        const webappUrl = getBaseUrl(req);
        const { entry } = req.body;

        if (!entry || !entry[0]) {
            return res.status(200).json({ received: true });
        }

        const changes = entry[0].changes[0];
        const messages = changes?.value?.messages;

        if (!messages || messages.length === 0) {
            return res.status(200).json({ received: true });
        }

        for (const message of messages) {
            const from        = message.from;
            const messageText = message.text?.body || '';
            if (!messageText) continue;

            const lowerMsg = messageText.toLowerCase().trim();
            console.log(`[Webhook] Incoming from: "${from}" | Message: "${messageText}"`);

            // --- ADMIN COMMAND: PUSH ALL ---
            if (lowerMsg === 'push_all') {
                console.log('[Webhook] ⚡ ADMIN TRIGGER: push_all');
                const scheduler = require('../services/scheduler');
                await scheduler.pushDailyRemindersManually();
                await whatsappService.sendTextMessage(from, `🚀 *Admin Control:* Manual push initiated for all users.`);
                continue;
            }

            // 1. Find the user from phone number
            const BotUser = require('../models/BotUser');
            
            // First, try exact match
            let botUser = await BotUser.findOne({ phone: from });
            
            // Second, try last 10 digits raw (common in your DB)
            if (!botUser && from.length >= 10) {
                const last10 = from.slice(-10);
                botUser = await BotUser.findOne({ phone: last10 });
            }

            // Third, try last 10 digits with '91' prefix
            if (!botUser && from.length >= 10) {
                const last10 = from.slice(-10);
                botUser = await BotUser.findOne({ phone: '91' + last10 });
            }

            if (!botUser) {
                // If user not in DB, send registration nudge
                await whatsappService.sendTextMessage(
                    from,
                    `❌ *Registration Required*\n\n` +
                    `You're not registered for EcoSaathi yet. Please sign up on the app to start tracking your eco-journey!\n\n` +
                    `👉 Join now: ${webappUrl}`
                );
                continue;
            }

            if (lowerMsg === 'stop' || lowerMsg === 'off') {
                botUser.preferred_time = 'Off';
                await botUser.save();
                await whatsappService.sendTextMessage(from, `✅ Nightly messages turned off. You can still log in the app! To turn back on, reply "start".`);
                continue;
            }
            if (lowerMsg === 'start' || lowerMsg.includes('change time to 21:00')) {
                botUser.preferred_time = '21:00';
                await botUser.save();
                await whatsappService.sendTextMessage(from, `✅ Nightly messages set to 21:00.`);
                continue;
            }
            if (lowerMsg.includes('change time to 21:30')) {
                botUser.preferred_time = '21:30';
                await botUser.save();
                await whatsappService.sendTextMessage(from, `✅ Nightly messages set to 21:30.`);
                continue;
            }
            if (lowerMsg.includes('change time to 22:00')) {
                botUser.preferred_time = '22:00';
                await botUser.save();
                await whatsappService.sendTextMessage(from, `✅ Nightly messages set to 22:00.`);
                continue;
            }
            
            // 2.5 Handle "yes" / "ready" to get questions immediately
            if (lowerMsg === 'yes' || lowerMsg === 'ready' || lowerMsg === 'questions') {
                const { questions, alreadyAnswered } = await botService.getTodayQuestions(botUser.userId);
                if (alreadyAnswered) {
                    await whatsappService.sendTextMessage(from, `🌟 *You're a legend!* You've already completed your reflection today. Your eco-streak is glowing! 🌿✨\n\nRest up, and let's save the planet again tomorrow 🌙`);
                } else {
                    let qText = `Here are today's questions:\n\n`;
                    questions.forEach((q, i) => {
                        qText += `*${i+1}.* ${q.text}\n`;
                    });
                    qText += `\nReply with 3 letters (e.g., *YNY*) to log your reflection!`;
                    await whatsappService.sendTextMessage(from, qText);
                }
                continue;
            }

            // 2.6 Handle "streak" or "stats" command
            if (lowerMsg === 'streak' || lowerMsg === 'stats') {
                const User = require('../models/User');
                const user = await User.findById(botUser.userId);
                await whatsappService.sendTextMessage(
                    from, 
                    `🔥 *Your Eco Stats*\n\n` +
                    `Streak: *${botUser.streak} days*\n` +
                    `Total Points: *${user ? user.points : 0}* 🌱\n\n` +
                    `Keep it up! Visit the app for more details: ${webappUrl}/raatkahisaab`
                );
                continue;
            }

            // 2.7 Handle "tips" or "help" command
            if (lowerMsg === 'tips' || lowerMsg === 'help') {
                const tip = await insightsService.getOrGenerateInsight(botUser.userId);
                await whatsappService.sendTextMessage(
                    from,
                    `💡 *Eco Tip of the Day*\n\n${tip}\n\n` +
                    `Reply *"yes"* to answer today's questions!`
                );
                continue;
            }


            // 3. Handle review command
            if (lowerMsg === 'review') {
                const { questions, alreadyAnswered, todayAnswer } = await botService.getTodayQuestions(botUser.userId);
                if (alreadyAnswered && todayAnswer) {
                    let reviewText = `📝 *Today's Review*\n\n`;
                    questions.forEach((q, i) => {
                        reviewText += `*Q${i+1}:* ${q.text}\n*Your Answer:* ${todayAnswer.answers[i]}\n\n`;
                    });
                    await whatsappService.sendTextMessage(from, reviewText.trim());
                } else {
                    await whatsappService.sendTextMessage(from, `You haven't answered today's questions yet!`);
                }
                continue;
            }

            // 4. Try to parse as 3-answer reply
            const answers = parseMultiAnswer(messageText);

            if (!answers) {
                // If not an answer, behave like a standard bot (No Gemini AI Chat)
                await whatsappService.sendTextMessage(
                    from,
                    `Hello! I am your EcoSaathi bot. 🌿\n\n` +
                    `_Are you ready to answer today's questions now? Reply *"yes"* to get them, or wait for your scheduled time._\n\n` +
                    `⚙️ To update your reminder time or view your stats, visit the app:\n🔗 ${webappUrl}/raatkahisaab`
                );
                continue;
            }

            // Check if already answered
            const { questions, alreadyAnswered } = await botService.getTodayQuestions(botUser.userId);
            if (alreadyAnswered) {
                await whatsappService.sendTextMessage(
                    from,
                    `🌿 *High Five!* You've already done your part today.\n` +
                    `🔥 Your eco-streak is safe and sound.\n\n` +
                    `📊 See your progress here → ${webappUrl}/raatkahisaab`
                );
                continue;
            }

            // Submit the answers
            const question_ids = questions.map(q => q.id);
            const result = await botService.submitInAppAnswer(botUser.userId, question_ids, answers);

            if (result.alreadyAnswered) {
                await whatsappService.sendTextMessage(
                    from,
                    `✅ Already saved today's reflection! Come back tomorrow 🌙`
                );
                continue;
            }

            // Build confirmation + webapp link
            const quote = getDailyQuote();
            let reviewText = `\n\n📝 *Your Answers:*\n`;
            questions.forEach((q, i) => {
                reviewText += `*Q${i+1}:* ${q.text}\n*A:* ${answers[i]}\n\n`;
            });

            let replyText = '';
            const isStreak30 = result.milestone === '30_day_streak';

            if (isStreak30) {
                replyText =
                    `🎉 *30-DAY STREAK!* Incredible!\n\n` +
                    `You've completed a full month of reflections!\n` +
                    `+${result.pointsAwarded} points earned 🌱\n\n` +
                    `💡 _"${quote.text}"_\n— ${quote.author}` +
                    reviewText +
                    `🏆 See your insights → ${webappUrl}/raatkahisaab`;
            } else {
                replyText =
                    `🌙 *Reflection saved!*\n\n` +
                    `🔥 Streak: *${result.streak} days*\n` +
                    `⭐ +${result.pointsAwarded} points\n\n` +
                    `💡 _"${quote.text}"_\n— ${quote.author}` +
                    reviewText +
                    `📱 See your full eco profile → ${webappUrl}/raatkahisaab`;
            }

            await whatsappService.sendTextMessage(from, replyText);
            console.log(`[Webhook] Processed reply from ${from}, streak: ${result.streak}`);

            // ── INSIGHT GENERATION (Once every 3 days) ──────────────────────────
            try {
                const User = require('../models/User');
                const userDoc = await User.findById(botUser.userId);
                
                const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
                const lastInsightTime = userDoc && userDoc.last_insight_at ? userDoc.last_insight_at.getTime() : 0;
                
                if (Date.now() - lastInsightTime >= THREE_DAYS_MS) {
                    console.log(`[Webhook] 3 days passed. Generating new insight for ${from}...`);
                    await insightsService.getOrGenerateInsight(botUser.userId);
                }
            } catch (insightErr) {
                console.error(`[Webhook] Insight generation failed:`, insightErr.message);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Webhook] Error:', error);
        res.status(200).json({ received: true });
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

        res.status(200).json({
            registered: !!botUser,
            botUser: botUser || null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get today's questions for in-app display
 * GET /api/bot/today
 */
exports.getTodayQuestionsHandler = async (req, res, next) => {
    try {
        const result = await botService.getTodayQuestions(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Submit in-app answer
 * POST /api/bot/answer
 */
exports.submitAnswerHandler = async (req, res, next) => {
    try {
        const { question_ids, answers } = req.body;

        if (!question_ids || !answers || question_ids.length !== 3 || answers.length !== 3) {
            return res.status(400).json({ error: 'Provide exactly 3 question_ids and 3 answers' });
        }

        const result = await botService.submitInAppAnswer(req.user._id, question_ids, answers);

        if (result.alreadyAnswered) {
            return res.status(409).json({ error: 'Already answered today', alreadyAnswered: true });
        }

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
