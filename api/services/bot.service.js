const BotUser = require('../models/BotUser');
const User = require('../models/User');
const Answer = require('../models/Answer');

// Question pool for Raat Ka Hisaab
const QUESTIONS = {
    food: [
        { id: 'food_1', text: 'Did you reduce food waste today?', category: 'food' },
        { id: 'food_2', text: 'Did you eat vegetarian meals today?', category: 'food' },
        { id: 'food_3', text: 'Did you compost food scraps today?', category: 'food' },
    ],
    water: [
        { id: 'water_1', text: 'Did you reduce water usage today?', category: 'water' },
        { id: 'water_2', text: 'Did you take a short shower today?', category: 'water' },
        { id: 'water_3', text: 'Did you fix any water leaks today?', category: 'water' },
    ],
    transport: [
        { id: 'transport_1', text: 'Did you use public transport today?', category: 'transport' },
        { id: 'transport_2', text: 'Did you walk/cycle today?', category: 'transport' },
        { id: 'transport_3', text: 'Did you carpool or share a ride?', category: 'transport' },
    ],
    waste: [
        { id: 'waste_1', text: 'Did you reduce single-use plastics today?', category: 'waste' },
        { id: 'waste_2', text: 'Did you recycle items today?', category: 'waste' },
        { id: 'waste_3', text: 'Did you reuse items instead of buying new?', category: 'waste' },
    ],
    nature: [
        { id: 'nature_1', text: 'Did you spend time in nature today?', category: 'nature' },
        { id: 'nature_2', text: 'Did you plant/care for a plant today?', category: 'nature' },
        { id: 'nature_3', text: 'Did you protect local wildlife today?', category: 'nature' },
    ],
};

const QUESTION_CATEGORIES = ['food', 'water', 'transport', 'waste', 'nature'];

/**
 * Register a user for the WhatsApp bot
 */
exports.registerBotUser = async (userId, phone, preferredTime) => {
    // Check if already registered
    let botUser = await BotUser.findOne({ userId });
    
    if (botUser) {
        botUser.preferred_time = preferredTime || botUser.preferred_time;
        await botUser.save();
        return botUser;
    }
    
    // Create new bot user
    botUser = await BotUser.create({
        userId,
        phone,
        preferred_time: preferredTime || '21:00',
        streak: 0,
    });
    
    return botUser;
};

/**
 * Get a question for the user (randomized from pool)
 */
exports.getRandomQuestion = () => {
    const category = QUESTION_CATEGORIES[Math.floor(Math.random() * QUESTION_CATEGORIES.length)];
    const questions = QUESTIONS[category];
    return questions[Math.floor(Math.random() * questions.length)];
};

/**
 * Get today's 3 deterministic questions (same for all users each day)
 * Uses day-of-year to cycle through categories consistently
 */
function getDailyQuestions() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const selected = [];
    // Pick 3 different categories for today using day offset
    for (let i = 0; i < 3; i++) {
        const catIndex = (dayOfYear + i) % QUESTION_CATEGORIES.length;
        const category = QUESTION_CATEGORIES[catIndex];
        const questions = QUESTIONS[category];
        const qIndex = Math.floor(dayOfYear / QUESTION_CATEGORIES.length) % questions.length;
        selected.push(questions[qIndex]);
    }
    return selected;
}

/**
 * Get today's questions + whether user already answered today
 * GET /api/bot/today
 */
exports.getTodayQuestions = async (userId) => {
    const questions = getDailyQuestions();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const todayAnswer = await Answer.findOne({
        userId,
        date: { $gte: today, $lt: tomorrow },
    }).lean();

    const botUser = await BotUser.findOne({ userId }).lean();

    return {
        questions,
        alreadyAnswered: !!todayAnswer,
        todayAnswer: todayAnswer || null,
        streak: botUser ? botUser.streak : 0,
    };
};

/**
 * Submit answers for today's questions in-app (mirrors webhook logic)
 * POST /api/bot/answer
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
        // Auto-create botUser record if they answer in-app without registering for WhatsApp
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

/**
 * Handle incoming WhatsApp message
 */
exports.handleWebhookMessage = async (phoneNumber, messageText) => {
    // Find bot user by phone
    const botUser = await BotUser.findOne({ phone: phoneNumber }).populate('userId');
    
    if (!botUser) {
        return { success: false, error: 'User not registered for bot' };
    }
    
    const userId = botUser.userId._id;
    const response = messageText.trim().toUpperCase();
    
    // Check if it's a valid response (Y/N/Hmm)
    if (!['Y', 'N', 'HMM'].includes(response)) {
        return { success: false, error: 'Invalid response. Please reply Y, N, or Hmm' };
    }
    
    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user already answered today
    let answer = await Answer.findOne({
        userId,
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });
    
    if (!answer) {
        // Create new answer for today
        const question = exports.getRandomQuestion();
        answer = await Answer.create({
            userId,
            date: new Date(),
            question_ids: [question.id],
            answers: [response === 'HMM' ? 'Hmm' : response],
            points_awarded: 5, // 5 points per daily response
        });
        
        // Update streak
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayAnswer = await Answer.findOne({
            userId,
            date: { $gte: yesterday, $lt: today },
        });
        
        if (yesterdayAnswer) {
            botUser.streak += 1;
        } else {
            botUser.streak = 1;
        }
        botUser.last_answered = new Date();
        await botUser.save();
        
        // Award points to user
        await User.findByIdAndUpdate(userId, {
            $inc: { points: 5 },
        });
        
        // Check if streak reached 30 days
        if (botUser.streak === 30) {
            // Award 50 bonus points
            await User.findByIdAndUpdate(userId, {
                $inc: { points: 50 },
            });
            
            return {
                success: true,
                milestone: '30_day_streak',
                message: '🎉 Congratulations! You\'ve completed 30 days of reflection! Check your insights.',
            };
        }
        
        return {
            success: true,
            streak: botUser.streak,
            points: 5,
            message: `Thanks for the answer! Your streak: ${botUser.streak} days 🔥`,
        };
    } else {
        // Already answered today
        return {
            success: false,
            error: 'You\'ve already answered today. See you tomorrow!',
        };
    }
};

/**
 * Generate 30-day insights for a user
 */
exports.generateInsights = async (userId) => {
    // Get last 30 days of answers
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const answers = await Answer.find({
        userId,
        date: { $gte: thirtyDaysAgo },
    }).lean();
    
    if (answers.length === 0) {
        return {
            userId,
            summary: 'Not enough data for insights yet.',
            totalResponses: 0,
            streak: 0,
        };
    }
    
    // Calculate stats
    const yesCount = answers.filter(a => a.answers.includes('Y')).length;
    const noCount = answers.filter(a => a.answers.includes('N')).length;
    const hmmCount = answers.filter(a => a.answers.includes('Hmm')).length;
    const totalResponses = answers.length;
    
    // Category breakdown
    const categoryStats = {};
    QUESTION_CATEGORIES.forEach(cat => {
        categoryStats[cat] = 0;
    });
    
    answers.forEach(answer => {
        answer.question_ids.forEach(qid => {
            const question = findQuestionById(qid);
            if (question) {
                categoryStats[question.category]++;
            }
        });
    });
    
    // Get streak from BotUser
    const botUser = await BotUser.findOne({ userId }).lean();
    const streak = botUser ? botUser.streak : 0;
    
    // Generate insights text
    const insights = generateInsightText(yesCount, noCount, hmmCount, totalResponses, categoryStats, streak);
    
    return {
        userId,
        insights,
        stats: {
            totalResponses,
            yesCount,
            noCount,
            hmmCount,
            yesPercentage: Math.round((yesCount / totalResponses) * 100),
            categoryStats,
        },
        streak,
    };
};

function findQuestionById(questionId) {
    for (const category in QUESTIONS) {
        const question = QUESTIONS[category].find(q => q.id === questionId);
        if (question) return question;
    }
    return null;
}

function generateInsightText(yesCount, noCount, hmmCount, total, categoryStats, streak) {
    let insight = `🌿 Your 30-Day Eco Journey\n\n`;
    
    insight += `📊 Overall Stats:\n`;
    insight += `✅ Yes: ${yesCount} times\n`;
    insight += `❌ No: ${noCount} times\n`;
    insight += `🤔 Hmm: ${hmmCount} times\n`;
    insight += `🔥 Streak: ${streak} days\n\n`;
    
    insight += `📈 Category Breakdown:\n`;
    for (const [cat, count] of Object.entries(categoryStats)) {
        if (count > 0) {
            insight += `${cat}: ${count} responses\n`;
        }
    }
    
    insight += `\n💡 Your Reflection:\n`;
    const yesPercentage = Math.round((yesCount / total) * 100);
    
    if (yesPercentage >= 70) {
        insight += `Amazing! You're consistently making eco-friendly choices. Keep up this momentum! 🌱`;
    } else if (yesPercentage >= 50) {
        insight += `Good effort! You're making progress. Try to increase your eco-actions slightly. 🌿`;
    } else {
        insight += `Don't worry! Small steps count. Pick one category to focus on next month. 🚀`;
    }
    
    return insight;
}

/**
 * Get bot user by userId
 */
exports.getBotUser = async (userId) => {
    return BotUser.findOne({ userId }).populate('userId', 'name phone');
};

/**
 * Update bot user preferences
 */
exports.updateBotUserPreferences = async (userId, preferredTime) => {
    const botUser = await BotUser.findOne({ userId });
    if (!botUser) {
        throw new Error('User not registered for bot');
    }
    
    botUser.preferred_time = preferredTime;
    await botUser.save();
    
    return botUser;
};
