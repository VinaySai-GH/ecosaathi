# 🌙 Raat Ka Hisaab — Nightly WhatsApp Reflection Bot

> Part of EcoSaathi | IIT Tirupati | BTech 2nd Year Project

A WhatsApp chatbot that sends 3 eco-reflection questions every night.
Users reply Y / N / Hmm. After 30 days they get a personalised eco-journal report.

---

## Project Structure

```
raatkahisaab/
├── server.js               ← Entry point. Webhook + message routing
├── handlers/
│   ├── whatsapp.js         ← sendMessage() utility
│   ├── onboarding.js       ← New user flow (name → time → active)
│   ├── answers.js          ← Parse Y/N/Hmm, update streak
│   ├── insights.js         ← 30-day personalised report
│   └── scheduler.js        ← Nightly cron job (sends questions)
├── models/
│   ├── User.js             ← User schema
│   ├── Question.js         ← Question schema
│   └── Session.js          ← Nightly session schema
├── data/
│   ├── questions.js        ← 195 questions across 5 categories
│   └── seedQuestions.js    ← Run once to load questions into DB
├── .env.example            ← Copy to .env and fill in
└── package.json
```

---

## Setup — Step by Step

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in your `.env`:
```
WHATSAPP_TOKEN=      # From Meta Developer Dashboard
PHONE_NUMBER_ID=     # From Meta Developer Dashboard
VERIFY_TOKEN=        # Any string you choose (e.g. ecosaathi_secret)
MONGO_URI=           # Your MongoDB Atlas connection string
PORT=3000
```

### 3. Seed the question bank
```bash
npm run seed
```
This loads all 195 questions into MongoDB. Run only once.

### 4. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### 5. Expose local server with ngrok (for development)
```bash
ngrok http 3000
```
Copy the `https://` URL — you need it for Meta webhook setup.

### 6. Register webhook on Meta
- Go to developers.facebook.com → Your App → WhatsApp → Configuration
- Callback URL: `https://your-ngrok-url.ngrok-free.app/webhook`
- Verify Token: same value as VERIFY_TOKEN in your .env
- Click Verify and Save
- Subscribe to the `messages` field

---

## How It Works

### User journey
```
User sends "Hi"
  → Bot asks for name
  → Bot asks for preferred time (9pm / 9:30pm / 10pm)
  → User is now ACTIVE

Every night at chosen time:
  → Bot sends 3 questions (one from 3 random categories)
  → User replies: Y N Hmm
  → Bot saves answers + updates streak

Day 30:
  → Bot sends personalised 30-day eco-journal report
```

### Question rotation
- 195 questions across 5 categories (39 each): food, water, transport, waste, nature
- Each night: 3 categories chosen randomly, 1 question per category
- No question repeats within 7 days for the same user

### Streak tracking
- Streak increments when user answers on consecutive days
- If user misses a day, streak resets to 1
- Milestone messages at 7, 14, 21, and 30 days

---

## Deploying to Render (Production)

1. Push code to GitHub
2. Go to render.com → New Web Service → Connect your repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env`
6. Deploy — Render gives you a permanent HTTPS URL
7. Update your Meta webhook URL to the Render URL

---

## Eco Pulse Integration (for Bharghav's group)

Every time a user answers questions, call:
```javascript
awardPoints(userId, 'raat_ka_hisaab_daily', 5)     // 5 pts per day
awardPoints(userId, 'raat_ka_hisaab_30day', 50)    // 50 pts at day 30
```
The `handleAnswers` function in `handlers/answers.js` is where to add these calls (look for the streak update block).
