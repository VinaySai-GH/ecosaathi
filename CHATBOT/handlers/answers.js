const User = require('../models/User');
const Session = require('../models/Session');
const { sendMessage } = require('./whatsapp');
const { send30DayInsights } = require('./insights');

// Maps various ways a user can say yes/no/hmm
function normaliseAnswer(word) {
  const w = word.toLowerCase().trim();
  if (['y', 'yes', 'ha', 'haan', 'yeah', 'yep', 'yup', 'han', '1'].includes(w)) return 'Y';
  if (['n', 'no', 'nahi', 'nope', 'na', 'nah', '0'].includes(w)) return 'N';
  if (['hmm', 'hm', 'maybe', 'shayad', 'sort of', 'kinda', 'h', '?', 'idk'].includes(w)) return 'H';
  return null;
}

async function handleAnswers(user, text) {
  // Find today's unanswered session for this user
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const session = await Session.findOne({
    userId: user._id,
    date: { $gte: today },
    answered: false
  }).populate('questions');

  // No active session — user replied at a random time
  if (!session) {
    await sendMessage(user.phone,
      `I haven't sent your questions yet tonight 🌙\n` +
      `I'll message you at *${user.preferredTime}*. See you then!`
    );
    return;
  }

  // Parse the reply
  const tokens = text.trim().split(/\s+/);
  const answers = tokens.map(normaliseAnswer).filter(Boolean);

  // Need exactly 3 answers
  if (answers.length !== 3) {
    await sendMessage(user.phone,
      `Please reply with *3 answers* separated by spaces.\n\n` +
      `For example: *Y N Hmm*\n\n` +
      `Your 3 questions were:\n` +
      `1️⃣ ${session.questions[0]?.text}\n` +
      `2️⃣ ${session.questions[1]?.text}\n` +
      `3️⃣ ${session.questions[2]?.text}`
    );
    return;
  }

  // Save answers to session
  await Session.updateOne(
    { _id: session._id },
    { answers, answered: true }
  );

  // Update streak
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const lastDate = user.lastAnsweredDate;
  const isConsecutive = lastDate && lastDate >= yesterday;

  const newStreak = isConsecutive ? user.streak + 1 : 1;

  await User.updateOne(
    { _id: user._id },
    { streak: newStreak, lastAnsweredDate: new Date() }
  );

  // Build streak message
  let streakMsg = `🔥 Streak: *${newStreak} day${newStreak > 1 ? 's' : ''}*`;
  if (newStreak === 7)  streakMsg += ` — one full week! 🎉`;
  if (newStreak === 14) streakMsg += ` — two weeks strong! 💪`;
  if (newStreak === 21) streakMsg += ` — three weeks! Almost there! 🌿`;
  if (newStreak === 30) streakMsg += ` — *30 days!* 🏆`;

  await sendMessage(user.phone,
    `✅ *Logged for today!*\n\n` +
    `${streakMsg}\n\n` +
    `_See you tomorrow night_ 🌙`
  );

  // Trigger 30-day insights after completing day 30
  if (newStreak === 30) {
    // Small delay so streak message arrives first
    setTimeout(() => send30DayInsights(user), 3000);
  }
}

module.exports = { handleAnswers };
