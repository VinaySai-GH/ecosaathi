# 🔧 Dashboard Integration Guide

## How to add the Bot Register Card to your dashboard

### 1. Find your dashboard component:
```
src/pages/dashboard/Dashboard.jsx
```

### 2. Add this import at the top:
```javascript
import BotRegisterCard from './components/BotRegisterCard.jsx';
```

### 3. Add this component to your JSX (where you want it displayed):
```javascript
<BotRegisterCard />
```

**Example placement** (in your dashboard render):
```jsx
<div style={styles.dashboardContainer}>
  {/* Existing content */}
  <h2>Your Profile</h2>
  {/* Profile settings here */}

  {/* Add this section */}
  <div style={styles.section}>
    <h3>Eco Habits</h3>
    <BotRegisterCard />
  </div>

  {/* More content */}
</div>
```

---

## How to add the Insights page to your router

### 1. Find your router config:
```
src/router.jsx
```

### 2. Add this import:
```javascript
import BotInsightsPage from './pages/dashboard/BotInsightsPage.jsx';
```

### 3. Add this route:
```javascript
{
  path: '/insights',
  element: <BotInsightsPage />
}
```

**Full example:**
```jsx
const routes = [
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      // ... existing routes
      {
        path: '/insights',
        element: <BotInsightsPage />
      }
    ]
  }
];
```

---

## Quick verification:

After adding both:

1. ✅ Visit `/dashboard` → should see BotRegisterCard
2. ✅ Click "Join Raat Ka Hisaab" → should register (if API works)
3. ✅ Visit `/insights` → should see insights page
4. ✅ API calls in network tab should show `/api/bot/register`, `/api/bot/status`, etc.

---

## Troubleshooting:

| Issue | Solution |
|-------|----------|
| "Module not found" | Check import path matches your file structure |
| Blank component | Might be loading state — check browser console for API errors |
| API 401 errors | Make sure user is logged in (token in Authorization header) |
| API 404 errors | Make sure backend server is running on port 5000 |

---

Done! 🎉