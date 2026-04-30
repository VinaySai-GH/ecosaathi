# 🌿 EcoSaathi

**A community sustainability app built for India.**

EcoSaathi makes environmental action tangible, social, and specific to the Indian context — turning abstract habits into real numbers, community maps, and campus-wide competition. Built by BTech students at IIT Tirupati as a pilot for college campuses across India.

---

## ✨ Features

### 🏠 Home Feed — Community Hub
A dedicated social feed for sharing eco-news, sustainable events, and reporting civic issues. Supports images, deep-linked location tags, and community discussions. It's the central town square for sustainability.

### 💧 Neeru — Water Bill Translator
Log your monthly water usage, and Neeru translates raw kilolitres into human-scale comparisons that actually hit home — *"your household used enough water to sustain 3 farming families in Tirupati for a month."* Tracks your 6-month trend and gives actionable reduction tips specific to Indian households.

### 👣 Carbon Prints — Footprint Wizard
A dynamic, multi-category carbon footprint tracker (electricity, transport, food, shopping, waste). An intuitive wizard calculates your monthly emissions with real-time feedback, showing exactly where your impact comes from and how to trim it down.

### 🗺️ Eco Atlas (Green Spot) — Community Eco Map
A community-maintained map of eco-friendly places near you: e-waste drop-off centres, zero-waste stores, organic markets, water refill stations, and composting facilities. Anyone can add a spot, upload photos, and verify each other's listings. The green choice becomes the easy choice.

### 🌬️ Pollution Sense — Real-time Air Quality
Stay informed with live Air Quality Index (AQI) monitoring. Uses OpenAQ integration to show accurate local pollution levels, combined with community-reported pollution hotspots on the map.

### 🌙 EcoSandhya — Nightly Reflection Bot
A WhatsApp chatbot that messages you every night for reflection. Tracks daily streaks across eco-friendly habits. Reply quickly, and over time your answers become a personalised eco-journal with behavioural insights. No app download required — it meets you where you already are.

### 🏆 Eco Pulse — Campus Leaderboard
All app features feed into a single Eco Pulse score. Users and cities compete on a live leaderboard — individual daily habits become collective identity and healthy competition. Points are dynamically awarded for logging water, verifying spots, or maintaining chat streaks.

### 📚 Eco Learn — Knowledge Hub
Your central repository for real-world environmental education. Users can get all the info related to practical environmental practices, sustainability, the plastic lifecycle, and good practices of urban/rural planning. Discover policies on environment and sustainable development in India, along with direct links to civic engagement platforms and learning resources to turn awareness into action.

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
   cd api
   npm install
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

50k+ active users in India, 6500+ verified eco-friendly locations(spot) on the map, and real measurable reduction in water usage — all driven by small daily actions.

*Small daily actions. Collective campus-scale impact.*
