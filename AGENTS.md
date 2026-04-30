# AGENTS.md — EcoSaathi AI Instructions

Read this entire file before writing any code.

---

## WHAT WE'RE BUILDING

EcoSaathi is a mobile app that makes sustainability tangible for Indian 
college students, starting with IIT Tirupati as the pilot campus.

**Core features:**
- **Neeru** — User logs water usage; translates into human-scale comparisons (e.g. "enough water for 4 farming families in Tirupati"), shows 6-month trends, and gives reduction tips.
- **Home (Social Feed)** — Community feed for sharing eco-news, events, and issues. Supports likes, comments, images, and map deep-linking.
- **Eco Atlas (Green Spot)** — Community-maintained map of eco-friendly places (e-waste, refills, etc.). Users add spots, upload photos, and verify each other's listings. Includes City Eco Score.
- **Carbon Prints** — Multi-category carbon footprint tracking (food, transport, electricity, waste) with real-time emission calculations and history.
- **Pollution Sense** — Real-time Air Quality Index (AQI) monitoring using OpenAQ integration and community pollution reports.
- **EcoSandhya** — Nightly WhatsApp chatbot for reflection. Tracks streaks and generates personalized behavior insights.
- **Eco Pulse** — Live campus leaderboard aggregating points from all features.

**Tech stack:**
- Frontend: Vite + React (Web application)
- Backend: Node.js + Express hosted on Render (free tier)
- Database: MongoDB Atlas
<!-- - Maps: Leaflet.js with OpenStreetMap (or Google Maps JS API for Places)
- Bot: Meta WhatsApp Cloud API (free tier, 1000 conversations/month)
- OCR: Manual entry (Scanning coming soon)
- Water benchmarks: CGWB public datasets + ICAR research for AP context -->

**Team:**
- Nikhil, Dhanushya, Shruthika → Backend & API
- Vinay Sai, Venky, Sree Advaithi → Frontend & UI
- Santhosh, Sai Jahnavi, Krishna → Green Spot feature
- Bharghav, Gopichand, Alok, Aditya Nivaas → Bot & Integration

**Timeline:** Mar 1 – Apr 22, 2026
- Mid eval demo: Mar 16 (Neeru + Green Spot in one app shell)
- Exam break: Mar 19–29 (no work)
- Closed beta: 20 users, Week 6
- Open test: 50 users, Week 7

---

## FOLDER STRUCTURE

ecosaathi/
├── api/               ← Node.js Backend
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── server.js
│
├── src/               ← Vite + React Frontend
│   ├── pages/         ← feature pages (neeru, carbon, etc)
│   ├── components/    ← reusable UI elements
│   ├── context/       ← Auth and global state
│   ├── services/      ← API client logic
│   ├── layouts/       ← Page wrappers (SidebarLayout)
│   ├── App.jsx
│   └── router.jsx
│
└── index.html         ← Frontend entry point

**The one rule:** if something is only used by one feature, it lives inside 
that feature's folder. If two or more features need it, it goes in shared/.
Features never import from each other — only from their own folder or shared/.

---

## DATABASE SCHEMA(requirements might be changed by now, do loose the constraints)

### User
```
{
  _id, name, phone, city, bio, points: number, 
  water_logs: [ObjectId], carbon_logs: [ObjectId], 
  createdAt
}
```

### Post (Home)
```
{
  _id, user: ObjectId, type: "news"|"event"|"issue",
  status: "persisting"|"solved", caption, image,
  locationText, locationCoords: { lat, lng },
  likes: [ObjectId], comments: [{ user, text, createdAt }],
  createdAt
}
```

### Spot (Eco Atlas)
```
{
  _id, name, category, lat, lng, address,
  tips: string[], photos: string[], 
  verified_by: [userId], added_by: userId,
  createdAt
}
```

---

## API CONTRACTS (Key Endpoints)

### Home Feed
```
GET  /api/posts?page=1   → { posts[], page, hasMore }
POST /api/posts         { type, caption, image, locationText, locationCoords }
DELETE /api/posts/:id
PUT    /api/posts/:id/status { status }
```

### User Profile
```
GET  /api/users/:id     → { user, posts[] }
PUT  /api/auth/profile  { name, bio, city, password }
```

---

## SCORING RULES (Eco Pulse)

- Neeru log submitted: 50 pts
- Neeru 5% reduction vs last month: +10 bonus pts
- Green Spot verified listing added: 30 pts
- Green Spot verification given: 5 pts
- EcoSandhya daily reply: 5 pts
- EcoSandhya 30-day streak: +50 bonus pts
(hostel changed to cities)
City score = sum of all member points ÷ number of members
(prevents large cities from dominating)
Leaderboard recalculates every 6 hours.

---

## HOW TO BUILD ANYTHING — follow this order

1. Write the TypeScript type/interface first (shared/types/ or feature.types.ts)
2. Write the mock that matches the expected API response (feature.mock.ts)
3. Write the backend (route → controller → service → model)
4. Write the frontend using the mock
5. Swap mock for real API call — should be a one-line change

The mock exists so frontend and backend can be built at the same time 
without anyone blocking anyone else.

---

## CODE RULES

- TypeScript everywhere. No `any`.
- One file = one job. No mixing API calls inside UI components.
- Functions max 30 lines. If longer, split and name each part clearly.
- No hardcoded numbers or strings — put them in shared/constants/.
- Every async function has try/catch with a typed error.
- Components never call APIs directly — that's the service file's job.

---

## BEFORE WRITING ANY CODE — always tell me:

1. Which feature folder does this go in?
2. What files will you create or modify?
3. Does anything need to go in shared/?
4. Is a mock needed?

Then ask: "Good to go?"

Write code only after I confirm.
Output one file at a time with the full path as the header.
Never combine two files into one code block.

---

## GIT COMMITS(no need(don't) to follow this now)

Commit after every meaningful unit of work — a screen done, a service wired up, a bug fixed, a type file written. Don't batch everything into one big commit.

**Write commits exactly like a tired but enthusiastic human developer messaging their team on Slack. Do NOT use conventional commits or machine-like strict formatting.**

Good examples:
```
finally got the neeru ui working with the animations
fixed that annoying tsconfig typescript error
downgraded to sdk 52 so we can actually use expo go lol
added the tips cards for the result screen
just built the tab navigator shell
```

Bad examples (NEVER use these robotic formats):
```
feat: implement NeeruManualEntryScreen component
chore: update shared/constants/index.ts
fix(ts): update extends path in tsconfig
Update equivalency data
```

Rules for the AI:
- ALL LOWERCASE. 
- No periods at the end.
- Use casual phrasing ("finally got", "fixed that annoying", "just built", "lol", "wow").
- NEVER use prefixes like `feat:`, `chore:`, `fix:`, or `docs:`.
- Speak entirely informally like a real human student hacking on a project at 2 AM.

---

### ✅ Done
- [x] Repo setup and Clean Architecture
- [x] Auth system (Register, Login, JWT protection)
- [x] **Neeru**: Water tracking, history, and equivalency engine (100%)
- [x] **Home**: Social feed with caching, likes, comments, and issue tracking (100%)
- [x] **Profiles**: Bio, post history grid, and side-by-side edit UI (100%)
- [x] **Eco Pulse**: Leaderboard and user ranking (100%)
- [x] **Carbon Prints**: Multi-category tracking and trends (100%)
- [x] **Green Spot**: Map integration, adding spots, and City Eco Score (100%)
- [x] **EcoSandhya**: WhatsApp bot integration and insights (100%)
- [x] **Pollution Sense**: AQI map and community reports (100%)

### 🟡 In Progress
- [ ] Final production environment hardening (bcrypt hashing completion)
- [ ] Cloudinary integration for image uploads (currently base64)

---

## HARD RULES & LEARNINGS

### 1. Technology Stack
Ensure the frontend matches **React 18.3.1** and **Vite ^6.0.0**. 

### 2. User ID Consistency
Always use `req.user._id` (ObjectId) instead of `req.user.id` to ensure proper MongoDB queries and data isolation.

### 3. Feed Caching
The Home feed uses a module-level cache in `Dashboard.jsx`. Navigating back to Home loads from cache unless a pull-to-refresh or a new post is triggered.

### 4. Component Standards
- One file = one job.
- Functions max 30 lines.
- Components never call APIs directly — use the service/api files.
- TypeScript strict mode where applicable (migrating codebase to TS).

<!-- Update this section as you build. The AI reads it to avoid 
rebuilding things that already exist. -->
