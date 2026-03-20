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
| Frontend | Vite + React (Web) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Maps | Leaflet.js / OpenStreetMap |
| WhatsApp Bot | Meta WhatsApp Cloud API |
| Tank Analysis | Manual entry (OCR coming soon) |
| Water Benchmarks | CGWB public datasets |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- `.env` files set up in both root and `/api` (see `.env.example`)

### Install and run

```bash
# Clone the repository
git clone https://github.com/your-org/ecosaathi.git
cd ecosaathi

# 1. Start the Frontend
npm install
npm run dev

# 2. Start the Backend (separate terminal)
cd api
npm install
npm run dev
```

---

## 🌱 The Goal

50+ active users on campus, 65+ verified eco-friendly locations on the map, and real measurable reduction in water usage — all driven by small daily actions.

*Small daily actions. Collective campus-scale impact.*
