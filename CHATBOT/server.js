require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { startScheduler } = require('./handlers/scheduler');
const { handleOnboarding } = require('./handlers/onboarding');
const { handleAnswers } = require('./handlers/answers');
const User = require('./models/User');

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// DATABASE
// ─────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startScheduler(); // Start nightly question scheduler
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────────────────────────
// WEBHOOK VERIFICATION
// Meta calls GET /webhook once to verify your server
// ─────────────────────────────────────────────────────────────
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified by Meta');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// ─────────────────────────────────────────────────────────────
// INCOMING MESSAGES
// Meta calls POST /webhook every time a user messages the bot
// ─────────────────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Always respond 200 immediately — or Meta will retry
  res.sendStatus(200);

  try {
    const body    = req.body;
    const entry   = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value   = changes?.value;

    // Ignore non-message events (status updates etc.)
    if (!value?.messages) return;

    const message = value.messages[0];
    const phone   = message.from;
    const text    = message.text?.body?.trim();

    // Ignore non-text messages (images, voice notes etc.)
    if (!text) return;

    console.log(`📩 [${phone}] "${text}"`);

    // Find user in DB
    const user = await User.findOne({ phone });

    // ── Route the message ──────────────────────────────────
    if (!user || user.state !== 'active') {
      // New user or mid-onboarding
      await handleOnboarding(phone, text);
    } else {
      // Active user — they're replying to tonight's questions
      await handleAnswers(user, text);
    }

  } catch (err) {
    console.error('❌ Error handling message:', err.message);
  }
});

// ─────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'EcoSandhya Bot' });
});

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 EcoSandhya Bot running on port ${PORT}`);
});
