# 🌿 EcoSaathi

**A community sustainability app built for India.**

EcoSaathi makes environmental action tangible, social, and specific to the Indian context — turning abstract habits into real numbers, community maps, and campus-wide competition. Built by BTech students at IIT Tirupati as a pilot for college campuses across India.

---

## ✨ Features

### 💧 Neeru — Water Bill Translator
Photograph your monthly water bill. Neeru translates raw kilolitres into human-scale comparisons that actually hit home — *"your household used enough water to sustain 3 farming families in Tirupati for a month."* Tracks your 6-month trend, benchmarks you against your city's per-capita average using CGWB data, and gives 3 reduction tips specific to Indian households. Generates a shareable monthly certificate.

### 🗺️ Green Spot — Community Eco Map
A community-maintained map of eco-friendly places near you: e-waste drop-off centres, zero-waste stores, organic markets, water refill stations, and composting facilities. Anyone can add a spot, upload photos, and verify each other's listings. The green choice becomes the easy choice.

### 🌙 Raat Ka Hisaab — Nightly Reflection Bot
A WhatsApp chatbot that messages you every night at a time you choose. Three rotating questions across food, water, transport, waste, and nature categories. Reply Y / N / Hmm — that's it. After 30 days your answers become a personalised eco-journal with behavioural insights. No app download required — it meets you where you already are.

### 🏆 Eco Pulse — Campus Leaderboard
All three features feed into a single Eco Pulse score. Hostels compete on a live campus leaderboard — individual daily habits become collective identity and healthy competition. Weekly digest notifications keep the momentum going.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Maps | Google Maps Platform |
| WhatsApp Bot | Meta WhatsApp Cloud API |
| Bill Scanning | Google ML Kit (on-device OCR) |
| Water Benchmarks | CGWB public datasets |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- MongoDB Atlas account
- `.env` file set up (see `.env.example`)

### Install and run

```bash
git clone https://github.com/your-org/ecosaathi.git
cd ecosaathi
npm install

# Start the mobile app
npx expo start

# Start the backend (separate terminal)
cd api && npm run dev
```

---

## 🌱 The Goal

50+ active users on campus, 65+ verified eco-friendly locations on the map, and real measurable reduction in water usage — all driven by small daily actions.

*Small daily actions. Collective campus-scale impact.*
