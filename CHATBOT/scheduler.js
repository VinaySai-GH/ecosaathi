const cron = require('node-cron');
const User = require('../models/User');
const Question = require('../models/Question');
const Session = require('../models/Session');
const { sendMessage } = require('./whatsapp');

// Pick 3 questions for a user — no repeats within 7 days
async function pick3Questions(userId) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get question IDs sent to this user in the last 7 days
  const recentSessions = await Session.find({
    userId,
    date: { $gte: sevenDaysAgo }
  });

  const recentIds = recentSessions
    .flatMap(s => s.questions)
    .map(id => id.toString());

  // Randomly pick 3 different categories from 5
  const allCategories = ['food', 'water', 'transport', 'waste', 'nature'];
  const shuffled = allCategories.sort(() => Math.random() - 0.5);
  const chosenCategories = shuffled.slice(0, 3);

  // From each category, pick one question not seen recently
  const selected = [];
  for (const category of chosenCategories) {
    const question = await Question.findOne({
      category,
      _id: { $nin: recentIds }
    });

    // Fallback: if all questions in this category were recently seen, pick any
    if (!question) {
      const fallback = await Question.findOne({ category });
      if (fallback) selected.push(fallback);
    } else {
      selected.push(question);
    }
  }

  return selected;
}

// Send nightly questions to one user
async function sendNightlyQuestions(user) {
  try {
    const questions = await pick3Questions(user._id);

    if (questions.length < 3) {
      console.error(`⚠️ Not enough questions for user ${user.phone}`);
      return;
    }

    // Create a session record for tonight
    const session = await Session.create({
      userId: user._id,
      date: new Date(),
      questions: questions.map(q => q._id),
      answers: [],
      answered: false
    });

    const dayNumber = user.streak + 1;

    const message =
      `🌙 *Raat Ka Hisaab — Day ${dayNumber}*\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `Here are today's 3 questions:\n\n` +
      `1️⃣ ${questions[0].text}\n\n` +
      `2️⃣ ${questions[1].text}\n\n` +
      `3️⃣ ${questions[2].text}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `Reply: *Y Y N* — one answer per question, space-separated.\n` +
      `_(Y = Yes, N = No, Hmm = not sure)_`;

    await sendMessage(user.phone, message);
    console.log(`🌙 Questions sent to ${user.name} (${user.phone})`);

  } catch (err) {
    console.error(`❌ Failed to send questions to ${user.phone}:`, err.message);
  }
}

// Runs every 30 minutes — checks who needs their questions right now
function startScheduler() {
  cron.schedule('*/30 * * * *', async () => {
    const now = new Date();
    // Format current time as "HH:MM" in IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const hours = String(ist.getUTCHours()).padStart(2, '0');
    const minutes = String(ist.getUTCMinutes()).padStart(2, '0');

    // Only trigger on exact half-hour marks (00 or 30)
    if (minutes !== '00' && minutes !== '30') return;

    const currentTime = `${hours}:${minutes}`;
    console.log(`⏰ Scheduler check: ${currentTime} IST`);

    // Find all active users whose preferred time matches now
    const users = await User.find({
      state: 'active',
      preferredTime: currentTime
    });

    if (users.length > 0) {
      console.log(`📨 Sending to ${users.length} user(s) at ${currentTime}`);
      for (const user of users) {
        await sendNightlyQuestions(user);
      }
    }
  });

  console.log('⏰ Nightly scheduler started (checks every 30 min)');
}

module.exports = { startScheduler, sendNightlyQuestions };
