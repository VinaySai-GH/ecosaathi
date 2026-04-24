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

### Install and Run

1. **Install Dependencies**
   ```bash
   npm install
   cd api && npm install
   ```

2. **Start the App (The Easy Way)**
   Open two terminals in the root folder:
   - **Terminal 1 (Web Interface):** `npm run dev`
   - **Terminal 2 (WhatsApp Bot):** `npm run dev:bot`

   *Note: `dev:bot` automatically kills lingering processes on port 5000 and starts both the backend server and the local tunnel.*

3. **Database Cleanup**
   If you need to reset "unknown" users or sync city names:
   ```bash
   cd api
   node scripts/cleanup_users.js
   ```

---

## 🧹 Repository Maintenance

Keep the repo clean by avoiding committing `.env` files or temporary logs. 
If you need to clear all node_modules and start fresh:
```bash
# Clean project
npm run clean  # if script added, otherwise:
rm -rf node_modules api/node_modules dist
```

---

## 🌱 The Goal

50+ active users on campus, 65+ verified eco-friendly locations on the map, and real measurable reduction in water usage — all driven by small daily actions.

*Small daily actions. Collective campus-scale impact.*
