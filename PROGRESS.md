# 🚀 EcoSaathi Project Progress — IIT Tirupati Pilot

This file tracks the current state of the EcoSaathi application. Use this as a reference when shifting between different LLMs or for project status reporting.

---

## 🏗️ Project Architecture
- **Frontend**: Vite + React 18
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **APIs**: Meta WhatsApp Business API, Gemini 1.5 Flash (AI Insights)
- **Deployment**: Localhost (Dev), Render (Production Target)

---

## ✅ Completed Features

### 1. Neeru (Water Tracking)
- [x] Manual entry for water usage (KL).
- [x] Equivalency calculator (Tirupati agricultural context).
- [x] 6-month history visualization.
- [x] Dynamic water-saving tips.

### 2. Raat Ka Hisaab (Reflection Bot)
- [x] WhatsApp bot registration with `preferred_time`.
- [x] **100+ rotating questions** across 5 categories (Food, Water, Transport, Waste, Nature).
- [x] **Personalized Questioning**: Adapts based on user data (high car usage → more transport questions).
- [x] Automated nightly WhatsApp notification.
- [x] Answer parsing from WhatsApp (e.g., "YNY", "Y N H").
- [x] In-app countdown timer and status tracking.
- [x] **50+ Motivational Quotes** library integrated into web and bot.

### 3. AI Eco-Coach (Gemini Integration)
- [x] **30-Day History Analysis**: Analyzes water logs, carbon data, and nightly reflections.
- [x] **Random WhatsApp Pushes**: 25% chance to trigger an insight after the nightly reflection.
- [x] Automated 3-4 day coaching cycle (cached for performance).
- [x] High-quality, culturally relevant prompts for IIT Tirupati students.

### 4. Eco Pulse (Leaderboard)
- [x] Hostel/City-based leaderboard.
- [x] Fair scoring (average per member).
- [x] **Weekly Broadcast**: Every Sunday at 6:00 PM, all users get a WhatsApp ranking update.

---

## 🛠️ Technical State & Config

### Environment Variables (`api/.env`)
- `MONGODB_URI`: Atlas connection string.
- `WHATSAPP_TOKEN`: Meta Graph API token.
- `WHATSAPP_PHONE_NUMBER_ID`: Meta Bot ID.
- `GEMINI_API_KEY`: Google AI key.
- `WEBAPP_URL`: Used for links inside WhatsApp messages.

### Critical Files
- `api/data/questions.js`: 100-question pool.
- `api/data/quotes.js`: 50-quote pool.
- `api/services/insights.service.js`: Gemini logic.
- `api/services/scheduler.js`: Cron jobs (Nightly Qs, Sunday Leaderboard).
- `src/pages/raatkahisaab/RaatKaHisaab.jsx`: Reflection UI.

---

## 🚧 Next Steps / Roadblocks
- [ ] **OCR Upgrade**: Transition from manual water entry to bill scanning.
- [ ] **Green Spot**: Map-based feature for eco-friendly campus locations.
- [ ] **Production URL**: Current setup uses `ngrok`. Needs static hosting (Render/Railway).

---

*Last Updated: 2026-04-23*
