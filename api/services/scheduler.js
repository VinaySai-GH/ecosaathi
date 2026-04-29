const cron             = require('node-cron');
const BotUser          = require('../models/BotUser');
const botService       = require('./bot.service');
const whatsappService  = require('./whatsapp.service');
const insightsService  = require('./insights.service');
const ecopulseService  = require('./ecopulse.service');

const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173';

/**
 * Scheduler — Sends nightly reflection questions via WhatsApp
 * Runs every minute to check if any user is due for notification.
 */
exports.initScheduler = () => {
    console.log('[Scheduler] Initializing nightly reflection job...');

    // ─── NIGHTLY QUESTIONS — every minute check ───────────────────────────────
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentHHmm = now.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Kolkata'
            });

            const usersToNotify = await BotUser.find({
                preferred_time: currentHHmm,
            });

            if (usersToNotify.length === 0) return;

            console.log(`[Scheduler] Checking ${usersToNotify.length} users for time ${currentHHmm}`);

            for (const botUser of usersToNotify) {
                const todayStr        = now.toDateString();
                const lastNotifiedStr = botUser.last_notified_at ? botUser.last_notified_at.toDateString() : '';
                const lastAnsweredStr = botUser.last_answered ? botUser.last_answered.toDateString() : '';

                if (lastNotifiedStr === todayStr || lastAnsweredStr === todayStr) {
                    continue;
                }

                // Get personalized questions for this user
                const { questions } = await botService.getTodayQuestions(botUser.userId);

                const message =
                    `🌙 *Raat Ka Hisaab* — Nightly Reflection\n\n` +
                    `Here are your 3 questions for today:\n\n` +
                    `1️⃣ ${questions[0].text}\n\n` +
                    `2️⃣ ${questions[1].text}\n\n` +
                    `3️⃣ ${questions[2].text}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `*How to reply:*\n` +
                    `Send 3 letters like *YNY* or *Y N H*\n` +
                    `(Y = Yes ✅ | N = No ❌ | H = Hmm 🤔)\n\n` +
                    `Example: *YYN* = Yes, Yes, No`;

                try {
                    await whatsappService.sendTextMessage(botUser.phone, message);

                    botUser.last_notified_at = now;
                    await botUser.save();

                    console.log(`[Scheduler] Sent questions to ${botUser.phone}`);
                } catch (err) {
                    console.error(`[Scheduler] Failed to send to ${botUser.phone}:`, err.message);
                }
            }
        } catch (error) {
            console.error('[Scheduler] Error in cron job:', error);
        }
    });

    // ─── RANDOM AI INSIGHTS — check every 6 hours ────────────────────────────
    cron.schedule('0 */6 * * *', async () => {
        console.log('[Scheduler] Checking for AI insight pushes...');
        try {
            const botUsers = await BotUser.find({});
            for (const botUser of botUsers) {
                try {
                    // getOrGenerateInsight handles the cooldown logic internally
                    await insightsService.getOrGenerateInsight(botUser.userId);
                } catch (err) {
                    console.error(`[Scheduler] Insight push failed for ${botUser.phone}:`, err.message);
                }
            }
        } catch (error) {
            console.error('[Scheduler] Insight cron error:', error);
        }
    });

    // ─── WEEKLY LEADERBOARD — every Sunday at 6 PM ───────────────────────────
    cron.schedule('0 18 * * 0', async () => {
        await exports.pushLeaderboardUpdate();
    });
};

/**
 * Manually push leaderboard update to all WhatsApp users (for Demos)
 */
exports.pushLeaderboardUpdate = async () => {
    console.log('[Scheduler] Pushing weekly leaderboard update...');
    try {
        const leaderboard = await ecopulseService.getLeaderboard();
        if (!leaderboard || leaderboard.length === 0) return;

        const top3 = leaderboard.slice(0, 3);
        const medals = ['🥇', '🥈', '🥉'];
        let rankingText =
            `🏆 *Eco Pulse — Campus Leaderboard*\n\n` +
            top3.map((entry, i) => `${medals[i]} *${entry.hostel}*: ${Math.round(entry.avg_score)} pts`).join('\n') +
            `\n\n_Scores are averaged per member for fairness._\n\n` +
            `📊 See full leaderboard → ${WEBAPP_URL}/ecopulse`;

        const botUsers = await BotUser.find({});
        for (const botUser of botUsers) {
            try {
                await whatsappService.sendTextMessage(botUser.phone, rankingText);
            } catch (err) {
                console.error(`[Scheduler] Push failed for ${botUser.phone}:`, err.message);
            }
        }
        console.log(`[Scheduler] Push complete to ${botUsers.length} users.`);
    } catch (error) {
        console.error('[Scheduler] Leaderboard push error:', error);
    }
};
/**
 * Manually push daily reflection questions to ALL users right now
 */
exports.pushDailyRemindersManually = async () => {
    console.log('[Scheduler] Manual daily reminder push starting...');
    try {
        const botUsers = await BotUser.find({});
        const now = new Date();

        for (const botUser of botUsers) {
            const { questions } = await botService.getTodayQuestions(botUser.userId);
            const message =
                `🌙 *Raat Ka Hisaab* — Nightly Reflection\n\n` +
                `Here are your 3 questions for today:\n\n` +
                `1️⃣ ${questions[0].text}\n\n` +
                `2️⃣ ${questions[1].text}\n\n` +
                `3️⃣ ${questions[2].text}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `*How to reply:*\n` +
                `Send 3 letters like *YNY* or *Y N H*\n\n` +
                `Example: *YYN* = Yes, Yes, No`;

            await whatsappService.sendTextMessage(botUser.phone, message);
            botUser.last_notified_at = now;
            await botUser.save();
        }
        console.log(`[Scheduler] Manual push complete to ${botUsers.length} users.`);
    } catch (error) {
        console.error('[Scheduler] Manual push error:', error);
    }
};
