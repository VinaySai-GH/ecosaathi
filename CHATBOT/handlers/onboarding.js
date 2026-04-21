const User = require('../models/User');
const { sendMessage } = require('./whatsapp');

const TIME_OPTIONS = {
  '1': '21:00',
  '2': '21:30',
  '3': '22:00'
};

// Called every time a message comes in
// Routes user through: new → waiting_name → waiting_time → active
async function handleOnboarding(phone, text) {
  let user = await User.findOne({ phone });

  // ── Brand new user ─────────────────────────────────────
  if (!user) {
    user = await User.create({ phone, state: 'new' });
  }

  // ── State: new → ask for name ──────────────────────────
  if (user.state === 'new') {
    await User.updateOne({ phone }, { state: 'waiting_name' });
    await sendMessage(phone,
      `🌿 *Namaste! Welcome to Raat Ka Hisaab* 🌙\n\n` +
      `Every night I'll send you 3 small questions about your day — food, water, transport, waste, and nature.\n\n` +
      `Just reply *Y / N / Hmm* for each question. That's it.\n\n` +
      `Your answers build into a personal eco-journal. After 30 days you get a report with real insights about your habits.\n\n` +
      `No app download. No signup form. Just this chat.\n\n` +
      `─────────────────\n` +
      `First, *what's your name?* 👋`
    );
    return;
  }

  // ── State: waiting_name → save name, ask for time ──────
  if (user.state === 'waiting_name') {
    const name = text.trim();

    if (name.length < 2) {
      await sendMessage(phone, 'Please tell me your name so I can greet you properly 🙏');
      return;
    }

    await User.updateOne({ phone }, { name, state: 'waiting_time' });
    await sendMessage(phone,
      `Nice to meet you, *${name}!* 🙏\n\n` +
      `What time should I send your nightly questions?\n\n` +
      `Reply with the number:\n` +
      `*1* → 9:00 PM\n` +
      `*2* → 9:30 PM\n` +
      `*3* → 10:00 PM`
    );
    return;
  }

  // ── State: waiting_time → save time, complete onboarding ─
  if (user.state === 'waiting_time') {
    const choice = text.trim();
    const chosenTime = TIME_OPTIONS[choice];

    if (!chosenTime) {
      await sendMessage(phone,
        'Please reply *1*, *2*, or *3* to choose your time:\n\n' +
        '*1* → 9:00 PM\n*2* → 9:30 PM\n*3* → 10:00 PM'
      );
      return;
    }

    await User.updateOne({ phone }, {
      preferredTime: chosenTime,
      state: 'active'
    });

    await sendMessage(phone,
      `✅ *All set, ${user.name}!*\n\n` +
      `I'll message you every night at *${chosenTime}*.\n\n` +
      `Your first Raat Ka Hisaab arrives tonight 🌙\n\n` +
      `_Small daily reflections. Big changes over 30 days._`
    );
    return;
  }
}

module.exports = { handleOnboarding };
