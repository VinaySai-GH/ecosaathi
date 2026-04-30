const Session = require('../models/Session');
const { sendMessage } = require('./whatsapp');

const CATEGORY_LABELS = {
  food: '🍱 Food',
  water: '💧 Water',
  transport: '🚶 Transport',
  waste: '♻️ Waste',
  nature: '🌿 Nature'
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function send30DayInsights(user) {
  try {
    // Fetch all sessions with questions populated
    const sessions = await Session.find({ userId: user._id, answered: true })
      .populate('questions')
      .sort({ date: 1 });

    if (sessions.length < 5) {
      await sendMessage(user.phone,
        `🌿 Keep going — your full 30-day report will be ready soon!`
      );
      return;
    }

    // ── Count Y answers per category ─────────────────────
    const catYes   = { food: 0, water: 0, transport: 0, waste: 0, nature: 0 };
    const catTotal = { food: 0, water: 0, transport: 0, waste: 0, nature: 0 };

    // ── Count Y answers per weekday ───────────────────────
    const dayYes   = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    const dayTotal = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };

    let totalYes = 0;
    let totalAnswers = 0;

    for (const session of sessions) {
      const dow = new Date(session.date).getDay();

      session.questions.forEach((q, i) => {
        const ans = session.answers[i];
        if (!q || !ans) return;

        catTotal[q.category]++;
        dayTotal[dow]++;
        totalAnswers++;

        if (ans === 'Y') {
          catYes[q.category]++;
          dayYes[dow]++;
          totalYes++;
        }
      });
    }

    // ── Compute per-category percentages ─────────────────
    const catPercent = {};
    for (const cat of Object.keys(catYes)) {
      catPercent[cat] = catTotal[cat] > 0
        ? Math.round((catYes[cat] / catTotal[cat]) * 100)
        : 0;
    }

    // ── Best and worst category ───────────────────────────
    const sorted = Object.keys(catPercent).sort((a, b) => catPercent[b] - catPercent[a]);
    const bestCat  = sorted[0];
    const worstCat = sorted[sorted.length - 1];

    // ── Weakest day of the week ───────────────────────────
    const dayPercent = {};
    for (let d = 0; d < 7; d++) {
      dayPercent[d] = dayTotal[d] > 0
        ? Math.round((dayYes[d] / dayTotal[d]) * 100)
        : 0;
    }
    const weakestDay = DAY_NAMES[
      Object.keys(dayPercent).sort((a, b) => dayPercent[a] - dayPercent[b])[0]
    ];
    const strongestDay = DAY_NAMES[
      Object.keys(dayPercent).sort((a, b) => dayPercent[b] - dayPercent[a])[0]
    ];

    // ── Overall score ─────────────────────────────────────
    const overallPct = Math.round((totalYes / totalAnswers) * 100);

    let overallEmoji = '🌱';
    if (overallPct >= 70) overallEmoji = '🌳';
    else if (overallPct >= 50) overallEmoji = '🌿';

    // ── Build the message ─────────────────────────────────
    const report =
      `🌿 *EcoSandhya — Your 30-Day Eco Journal*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*${user.name}*, you answered *${totalAnswers} questions* over 30 nights.\n\n` +

      `${overallEmoji} *Overall score: ${overallPct}%*\n` +
      `You made a conscious choice ${totalYes} out of ${totalAnswers} times.\n\n` +

      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `📊 *Breakdown by area:*\n\n` +
      Object.keys(catPercent)
        .sort((a, b) => catPercent[b] - catPercent[a])
        .map(cat => {
          const pct = catPercent[cat];
          const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
          return `${CATEGORY_LABELS[cat]}\n${bar} ${pct}%`;
        })
        .join('\n\n') +

      `\n\n━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Strongest area: ${CATEGORY_LABELS[bestCat]}* (${catPercent[bestCat]}%)\n` +
      `You're most consistent here — whatever you're doing, keep it up!\n\n` +

      `⚠️ *Area to focus on: ${CATEGORY_LABELS[worstCat]}* (${catPercent[worstCat]}%)\n` +
      `Small changes here will make the biggest difference.\n\n` +

      `📅 *Best day: ${strongestDay}* — you're most mindful then.\n` +
      `📅 *Toughest day: ${weakestDay}* — maybe your busiest? Be extra mindful on ${weakestDay}s.\n\n` +

      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Thank you for 30 nights of reflection, ${user.name}._\n` +
      `_Your journal continues tonight. See you at ${user.preferredTime}_ 🌙`;

    await sendMessage(user.phone, report);

  } catch (err) {
    console.error('❌ Insight generation failed:', err.message);
  }
}

module.exports = { send30DayInsights };
