const BotUser  = require('../models/BotUser');
const User     = require('../models/User');
const Answer   = require('../models/Answer');
const { getDailyQuestions, getPersonalizedQuestions, findQuestionById, ALL_QUESTIONS } = require('../data/questions');
const { getDailyQuote } = require('../data/quotes');

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register a user for the WhatsApp bot
 */
exports.registerBotUser = async (userId, phone, preferredTime) => {
    let botUser = await BotUser.findOne({ userId });

    if (botUser) {
        botUser.preferred_time = preferredTime || botUser.preferred_time;
        await botUser.save();
        return botUser;
    }

    botUser = await BotUser.create({
        userId,
        phone,
        preferred_time: preferredTime || '21:00',
        streak: 0,
    });

    return botUser;
};

// ─── Daily Questions ──────────────────────────────────────────────────────────

/**
 * Get today's 3 questions + user status + daily quote
 * Used by both the webapp (GET /api/bot/today) and the WhatsApp scheduler
 */
exports.getTodayQuestions = async (userId) => {
    // Use personalized questions if userId is provided
    const questions = userId
        ? await getPersonalizedQuestions(userId)
        : getDailyQuestions();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const todayAnswer = await Answer.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow },
    }).lean();

    const botUser = await BotUser.findOne({ userId }).lean();
    const quote = getDailyQuote();

    // Check if streak is still active (was answered today or yesterday)
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const hasRecentAnswer = await Answer.findOne({
        userId,
        date: { $gte: yesterday }
    });
    
    const activeStreak = hasRecentAnswer ? (botUser ? botUser.streak : 0) : 0;

    // Fetch last 7 days of answers for the calendar
    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const recentAnswers = await Answer.find({
        userId,
        date: { $gte: sevenDaysAgo }
    }).select('date').lean();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().split('T')[0];
        const answered = recentAnswers.some(a => a.date.toISOString().split('T')[0] === dateStr);
        return answered;
    });

    return {
        questions,
        alreadyAnswered: !!todayAnswer,
        todayAnswer: todayAnswer || null,
        streak: activeStreak,
        preferredTime: botUser ? botUser.preferred_time : '21:00',
        quote,
        last7Days,
    };
};

// ─── Answer Submission ────────────────────────────────────────────────────────

/**
 * Submit answers for today's questions (from webapp or WhatsApp)
 */
exports.submitInAppAnswer = async (userId, question_ids, answers) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Guard: already answered today
    const existing = await Answer.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow },
    });
    if (existing) {
        return { success: false, alreadyAnswered: true };
    }

    // Save answer
    await Answer.create({
        userId,
        date: new Date(),
        question_ids,
        answers,
        points_awarded: 5,
    });

    // Update streak
    let botUser = await BotUser.findOne({ userId });
    if (!botUser) {
        const user = await User.findById(userId);
        botUser = await BotUser.create({
            userId,
            phone: user.phone,
            preferred_time: '21:00',
            streak: 0,
        });
    }

    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayAnswer = await Answer.findOne({
        userId,
        date: { $gte: yesterday, $lt: today },
    });

    botUser.streak = yesterdayAnswer ? botUser.streak + 1 : 1;
    botUser.last_answered = new Date();
    await botUser.save();

    // Award 5 pts + 50 bonus on 30-day streak
    const bonusPoints = botUser.streak === 30 ? 50 : 0;
    await User.findByIdAndUpdate(userId, { $inc: { points: 5 + bonusPoints } });

    return {
        success: true,
        streak: botUser.streak,
        pointsAwarded: 5 + bonusPoints,
        milestone: botUser.streak === 30 ? '30_day_streak' : null,
    };
};

// ─── Webhook (WhatsApp) ───────────────────────────────────────────────────────

/**
 * Handle incoming WhatsApp message (legacy single-answer flow)
 */
exports.handleWebhookMessage = async (phoneNumber, messageText) => {
    const botUser = await BotUser.findOne({ phone: phoneNumber }).populate('userId');

    if (!botUser) {
        return { success: false, error: 'User not registered for bot' };
    }

    const userId = botUser.userId._id;
    const response = messageText.trim().toUpperCase();

    if (!['Y', 'N', 'HMM'].includes(response)) {
        return { success: false, error: 'Invalid response. Please reply Y, N, or Hmm' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let answer = await Answer.findOne({
        userId,
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (answer) {
        return { success: false, error: 'You\'ve already answered today. See you tomorrow!' };
    }

    const questions = getDailyQuestions();
    answer = await Answer.create({
        userId,
        date: new Date(),
        question_ids: [questions[0].id],
        answers: [response === 'HMM' ? 'Hmm' : response],
        points_awarded: 5,
    });

    // Update streak
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayAnswer = await Answer.findOne({
        userId,
        date: { $gte: yesterday, $lt: today },
    });

    botUser.streak = yesterdayAnswer ? botUser.streak + 1 : 1;
    botUser.last_answered = new Date();
    await botUser.save();

    await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });

    if (botUser.streak === 30) {
        await User.findByIdAndUpdate(userId, { $inc: { points: 50 } });
        return {
            success: true,
            milestone: '30_day_streak',
            message: '🎉 30 days! Check your insights.',
        };
    }

    return {
        success: true,
        streak: botUser.streak,
        points: 5,
        message: `Thanks! Streak: ${botUser.streak} days 🔥`,
    };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

exports.getRandomQuestion = () => {
    return ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
};

exports.getBotUser = async (userId) => {
    return BotUser.findOne({ userId }).populate('userId', 'name phone');
};

exports.updateBotUserPreferences = async (userId, preferredTime) => {
    const botUser = await BotUser.findOne({ userId });
    if (!botUser) throw new Error('User not registered for bot');
    botUser.preferred_time = preferredTime;
    await botUser.save();
    return botUser;
};

/**
 * Generate 30-day insights for a user
 */
exports.generateInsights = async (userId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const answers = await Answer.find({
        userId,
        date: { $gte: thirtyDaysAgo },
    }).lean();

    if (answers.length === 0) {
        return { userId, summary: 'Not enough data yet.', totalResponses: 0, streak: 0 };
    }

    const yesCount = answers.filter(a => a.answers.includes('Y')).length;
    const noCount  = answers.filter(a => a.answers.includes('N')).length;
    const hmmCount = answers.filter(a => a.answers.includes('Hmm')).length;
    const total    = answers.length;

    const botUser = await BotUser.findOne({ userId }).lean();
    const streak  = botUser ? botUser.streak : 0;

    const yesPercent = Math.round((yesCount / total) * 100);
    let insight = `🌿 Your 30-Day Eco Journey\n\n`;
    insight += `📊 Overall: ✅ ${yesCount} Yes | ❌ ${noCount} No | 🤔 ${hmmCount} Hmm\n`;
    insight += `🔥 Streak: ${streak} days\n\n`;

    if (yesPercent >= 70) {
        insight += `Amazing! You're consistently making eco-friendly choices. 🌱`;
    } else if (yesPercent >= 50) {
        insight += `Good effort! Try increasing your eco-actions slightly. 🌿`;
    } else {
        insight += `Small steps count. Pick one category to focus on next month. 🚀`;
    }

    return {
        userId,
        insights: insight,
        stats: { totalResponses: total, yesCount, noCount, hmmCount, yesPercentage: yesPercent },
        streak,
    };
};
