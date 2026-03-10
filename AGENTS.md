# AGENTS.md — EcoSaathi AI Instructions

Read this entire file before writing any code.

---

## WHAT WE'RE BUILDING

EcoSaathi is a mobile app that makes sustainability tangible for Indian 
college students, starting with IIT Tirupati as the pilot campus.

**4 features:**
- **Neeru** — user photographs their monthly water bill, app translates 
  usage into human-scale comparisons (e.g. "enough water for 4 farming 
  families in Tirupati for a month"), shows a 6-month trend, gives 3 
  reduction tips specific to Indian households, generates a shareable 
  certificate
- **Green Spot** — community-maintained Google Maps overlay of eco-friendly 
  places: e-waste centres, zero-waste stores, organic markets, water refill 
  stations, composting facilities. Users add spots, upload photos, and verify 
  each other's listings
- **Raat Ka Hisaab** — nightly WhatsApp chatbot that sends 3 rotating 
  reflection questions across food/water/transport/waste/nature. One-tap 
  Y/N/Hmm replies. Tracks streaks. After 30 days generates a personalised 
  behaviour insight report
- **Eco Pulse** — aggregates all 3 features into a neighbourhood score. 
  IIT Tirupati hostels compete on a live campus leaderboard. Weekly digest 
  notification sent automatically

**Tech stack:**
- Frontend: React Native with Expo (single codebase for Android + iOS)
- Backend: Node.js + Express hosted on Render (free tier)
- Database: MongoDB Atlas
- Maps: Google Maps Platform (Maps SDK + Places API)
- Bot: Meta WhatsApp Cloud API (free tier, 1000 conversations/month)
- OCR: Google ML Kit on-device for bill scanning, manual entry as fallback
- Water benchmarks: CGWB public datasets + ICAR research for AP context

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
├── shared/
│   ├── types/         ← TypeScript interfaces used by 2+ features
│   ├── constants/     ← scoring values, route names, env keys, city list
│   ├── hooks/         ← useAuth, useCurrentUser, usePoints
│   ├── utils/         ← pure functions only (formatDate, truncate etc.)
│   └── mocks/         ← mock API responses for local development
│
├── features/
│   ├── neeru/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── neeru.service.ts   ← all API calls for this feature
│   │   ├── neeru.utils.ts     ← equivalency math (works fully offline)
│   │   ├── neeru.types.ts     ← types only used inside neeru
│   │   └── neeru.mock.ts      ← fake data so feature runs without backend
│   ├── greenspot/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── greenspot.service.ts
│   │   ├── greenspot.types.ts
│   │   └── greenspot.mock.ts
│   ├── raatkahisaab/
│   │   ├── bot/               ← WhatsApp webhook handler
│   │   ├── questions/         ← question pool + rotation logic
│   │   ├── rkt.service.ts
│   │   ├── rkt.types.ts
│   │   └── rkt.mock.ts
│   └── ecopulse/
│       ├── leaderboard/
│       ├── scoring/
│       ├── ecopulse.service.ts
│       ├── ecopulse.types.ts
│       └── ecopulse.mock.ts
│
├── api/
│   ├── routes/        ← one file per feature
│   ├── controllers/   ← one file per feature
│   ├── services/      ← business logic, one file per feature
│   ├── models/        ← MongoDB schemas
│   └── middleware/    ← auth, error handler, rate limiter
│
└── app/
    ├── navigation/
    └── App.tsx

**The one rule:** if something is only used by one feature, it lives inside 
that feature's folder. If two or more features need it, it goes in shared/.
Features never import from each other — only from their own folder or shared/.

---

## DATABASE SCHEMA

### User
```
{
  _id, name, phone, hostel, points: number, createdAt
}
```

### WaterLog (Neeru)
```
{
  _id, userId, month: number, year: number,
  city: string, kl_used: number, createdAt
}
```

### Spot (Green Spot)
```
{
  _id, name, category, lat, lng, address,
  tips: string[], photos: string[], 
  verified_by: userId[], added_by: userId,
  createdAt
  // category: "ewaste"|"zerowaste"|"organic"|"refill"|"composting"
}
```

### BotUser (Raat Ka Hisaab)
```
{
  _id, userId, phone, preferred_time: "21:00"|"21:30"|"22:00",
  streak: number, last_answered: Date, createdAt
}
```

### Answer (Raat Ka Hisaab)
```
{
  _id, userId, date, question_ids: string[],
  answers: ("Y"|"N"|"Hmm")[], points_awarded: number
}
```

### LeaderboardEntry (Eco Pulse)
```
{
  _id, hostel: string, month: number, year: number,
  total_points: number, member_count: number, avg_score: number
}
```

---

## API CONTRACTS

### Auth
```
POST /api/auth/register  { name, phone, hostel }  →  { token, user }
POST /api/auth/login     { phone }                →  { token, user }
```

### Neeru
```
POST /api/neeru/log      { month, year, city, kl_used }  →  { log, equivalencies }
GET  /api/neeru/history  {}                              →  { logs[] }
```

### Green Spot
```
GET  /api/spots          { category?, lat?, lng? }            →  { spots[] }
POST /api/spots          { name, category, lat, lng, address } →  { spot }
POST /api/spots/:id/verify  {}                                →  { spot }
```

### Raat Ka Hisaab
```
POST /api/bot/register   { phone, preferred_time }  →  { success }
POST /api/bot/webhook    WhatsApp payload            →  { success }
```

### Eco Pulse
```
GET  /api/leaderboard     { month? }  →  { entries[] }
GET  /api/leaderboard/me  {}          →  { rank, points, hostel_score }
```

---

## SCORING RULES (Eco Pulse)

- Neeru log submitted: 50 pts
- Neeru 5% reduction vs last month: +10 bonus pts
- Green Spot verified listing added: 30 pts
- Green Spot verification given: 5 pts
- Raat Ka Hisaab daily reply: 5 pts
- Raat Ka Hisaab 30-day streak: +50 bonus pts

Hostel score = sum of all member points ÷ number of members
(prevents large hostels from dominating)
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

## GIT COMMITS

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

## PROGRESS

### Done
- [x] Repo setup and folder structure
- [x] Clean architecture and design system (`shared/constants/theme.ts`)
- [x] Neeru manual entry screen + equivalency calculator UI
- [x] Neeru static datasets (equivalencies, cities, water tips)
- [x] Bottom tab navigation setup

### In Progress
- [ ] Connect Neeru UI to backend (swap mock data for real API)

### Next
- [ ] MongoDB schemas (User, WaterLog, Spot, BotUser, Answer)
- [ ] Auth routes (register + login)
- [ ] Neeru integration (charts and real data)
- [ ] Green Spot map with seed pins

---

## HARD RULES & LEARNINGS

### 1. Expo SDK version
**Always use Expo SDK 54.** This version is special because it requires **React 19** and **React Native 0.81**. Do not attempt to downgrade these to version 18/0.78 as it causes major version mismatches. Also, ensure `react-native-worklets` is installed as a peer dependency for Reanimated v4. If installing new Expo packages, always use `npx expo install <pkg>` to let the CLI handle versioning.

### 2. TypeScript Strictness
The project uses strict TypeScript compilation (`"strict": true`). Do not use smart/curly apostrophes (like `’` or `‘`) inside string literals in `.ts` files as it causes TypeScript Parser errors (`error TS1005: ':' expected`). Stick to plain ASCII straight quotes (`'`).

### 3. IDE Sync Issues
If `node_modules` is ever completely wiped and reinstalled, the IDE might throw `File 'expo/tsconfig.base' not found`. The fix is to add the explicit `.json` extension in `tsconfig.json`: `"extends": "expo/tsconfig.base.json"`.

<!-- Update this section as you build. The AI reads it to avoid 
rebuilding things that already exist. -->