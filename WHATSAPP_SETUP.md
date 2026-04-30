# 📱 WhatsApp Bot Setup Guide
**EcoSaathi EcoSandhya — Complete Integration**

---

## ❓ "Where shall I receive messages from?"

Messages are sent through **Meta WhatsApp Cloud API**. This requires:
1. A **Meta Business Account**
2. A **WhatsApp Business Account**
3. A **Phone Number** (real number or virtual number from Meta)

You don't receive messages on your personal phone. Instead:
- The bot uses a **shared business phone number** (like +1234567890)
- Users message THIS number from their personal WhatsApp
- Messages route through Meta's servers → your backend webhook
- Your server processes → sends response back via WhatsApp

---

## 🚀 Step 1: Create Meta Business Account

1. Go to [business.facebook.com](https://business.facebook.com)
2. Click **"Create Account"**
3. Fill in:
   - Business name: `EcoSaathi`
   - Your name: (your name)
   - Business email: your_email@example.com
   - Country: India
4. Click **Create Account**
5. Verify your email

---

## 📱 Step 2: Get WhatsApp Business Account

1. In Meta Business Suite, go to **Apps**
2. Search for and add **WhatsApp**
3. Click **WhatsApp Business Account**
4. Click **Create New Account**
5. Fill in:
   - Account name: `EcoSaathi`
   - Phone number: (can be virtual, Meta will provide)
   - Industry: `Non-profit / Education`
6. Accept terms
7. Click **Create Account**

**Meta will give you a BUSINESS PHONE NUMBER** (e.g., +1 (123) 456-7890)
→ Save this number! Users will message THIS number.

---

## 🔑 Step 3: Get API Credentials

### Get Phone Number ID:
1. Go to WhatsApp Business Account settings
2. Find **Phone numbers** section
3. Click on your phone number
4. Copy the **Phone Number ID** (looks like: `123456789012345`)
5. Save as: `WHATSAPP_PHONE_NUMBER_ID`

### Get Access Token:
1. Go to **System User** (in Business Settings)
2. Create a new System User if needed
3. Click on the user
4. Click **Generate Token**
5. Scope: Select `whatsapp_business_messaging`
6. Expiry: `Never expires` (or set to yearly)
7. Copy the token
8. Save as: `WHATSAPP_TOKEN`

---

## 🔧 Step 4: Configure Webhook

Your webhook receives messages at:
```
POST /api/bot/webhook
```

### In Meta WhatsApp Console:

1. Go to **Settings → Webhooks**
2. Click **Edit**
3. **Callback URL:**
   ```
   https://your-domain.com/api/bot/webhook
   ```
   (Replace with your actual domain — must be HTTPS!)

4. **Verify Token:**
   ```
   ecosaathi_bot_secret_2024
   ```
   (Or set your own in .env as `WHATSAPP_WEBHOOK_TOKEN`)

5. **Subscribe to webhook fields:**
   - ✅ messages
   - ✅ message_template_status_update
   - ✅ message_template_quality_update

6. Click **Verify and Save**

Meta will make a GET request to your webhook. Your code will:
```javascript
// GET /api/bot/webhook?hub.challenge=...&hub.verify_token=...
const challenge = req.query['hub.challenge'];
const token = req.query['hub.verify_token'];
if (token === 'ecosaathi_bot_secret_2024') {
    res.send(challenge);
}
```

---

## 📋 Step 5: Add .env Variables

In `/api/.env` file:

```env
# WhatsApp Cloud API Credentials
WHATSAPP_TOKEN=YOUR_ACCESS_TOKEN_HERE
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID_HERE
WHATSAPP_WEBHOOK_TOKEN=ecosaathi_bot_secret_2024

# Gemini API (for eco insights)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Frontend callback URL
WEBAPP_URL=http://localhost:5173
```

---

## ✅ Step 6: Test the Connection

1. **Start your backend:**
   ```bash
   cd api
   npm run dev
   ```

2. **Open Meta Webhook Tester** (in WhatsApp console)
3. Click **Send test message**
4. Should see `200 OK`

---

## 📱 How to Add New Phone Numbers to Receive Messages

### Option 1: Add more business numbers (requires Meta approval)
1. In WhatsApp Business Account → Phone numbers
2. Click **Add number**
3. Choose: Add existing number or get new number from Meta
4. Verify the number
5. Repeat steps from "Get API Credentials" for the new number

### Option 2: Handle multiple numbers in your webhook
If you have multiple business numbers, your webhook can handle all of them:

```javascript
// In bot.controller.js
const phoneNumberId = req.body.entry[0].changes[0].value.metadata.phone_number_id;

// Check which business number this is from
if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID) {
    // Process normally
} else if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID_2) {
    // Handle alternate number
}
```

---

## 👥 How Users Register Their Personal Numbers

**Users DO NOT register their personal WhatsApp numbers in EcoSaathi app.**

Instead:
1. User creates account in app with their phone: `+919876543210`
2. User opens WhatsApp
3. User adds the **business number** to contacts (e.g., `+1 (123) 456-7890`)
4. User texts the business number: `Hi` or `Start`
5. Bot responds with: *"Sign up first on the EcoSaathi app to register for EcoSandhya"*
6. User goes to app → clicks **"Join EcoSandhya"** → selects time
7. Bot now recognizes them and sends nightly messages

**Database mapping:**
```
User.phone = "+919876543210"        ← their personal number
BotUser.phone = "+919876543210"     ← same personal number (stored in your app)
WHATSAPP_PHONE_NUMBER_ID            ← the business number messages come FROM
```

When webhook receives message:
```javascript
const from = message.from;  // This is user's personal number
// Look up in BotUser by this personal number
const botUser = await BotUser.findOne({ phone: from });
```

---

## 🧪 Test Webhook Locally (Without HTTPS)

If you're developing locally without HTTPS, use **ngrok**:

```bash
# Install ngrok (Windows)
choco install ngrok

# Or download from https://ngrok.com/download

# Start ngrok tunnel
ngrok http 5000

# Output:
# https://abc123.ngrok.io → http://localhost:5000

# Use in Meta Webhook settings:
# Callback URL: https://abc123.ngrok.io/api/bot/webhook
```

---

## 📨 Sending Messages Programmatically

The code already handles this via `whatsappService.sendTextMessage()`:

```javascript
// In your code:
const whatsappService = require('../services/whatsapp.service');

await whatsappService.sendTextMessage(
    '919876543210',  // User's phone number
    '🌙 Tonight\'s question: Did you reduce water usage?'
);
```

---

## ⚠️ Important: Rate Limits & Restrictions

Meta WhatsApp Cloud API has limits:
- **Free tier:** 100 unique conversations/day
- **Business tier:** Unlimited (paid)
- **Rate:** Max ~50 messages/second
- **Messages must be within 24 hours** of last user message (otherwise marked as promotional)

**For EcoSandhya:**
- Send at scheduled time (no response needed until user replies)
- User has 24 hours to reply
- Response will be within 24-hour window

---

## 🔗 Environment Variables Summary

| Variable | Example | Where to get |
|----------|---------|--------------|
| `WHATSAPP_TOKEN` | `ABCd1234...` | WhatsApp Console → System User → Generate Token |
| `WHATSAPP_PHONE_NUMBER_ID` | `123456789012345` | WhatsApp Console → Phone Numbers |
| `WHATSAPP_WEBHOOK_TOKEN` | `ecosaathi_bot_secret_2024` | You set this yourself |
| `GEMINI_API_KEY` | `AIzaSyC...` | Google Cloud Console → Gemini API |
| `WEBAPP_URL` | `http://localhost:5173` | Your frontend URL |

---

## 🚀 Deployment Checklist

Before going to production:

- [ ] WhatsApp Business Account created
- [ ] Phone Number activated + verified
- [ ] API credentials generated
- [ ] .env file has all 5 variables
- [ ] Webhook URL configured in Meta console (HTTPS!)
- [ ] Webhook verification working (200 OK)
- [ ] Test message received + response sent
- [ ] Backend deployed to Render/Heroku
- [ ] Users can register via app
- [ ] Nightly messages sent at correct time

---

## 🆘 Troubleshooting

### Webhook not receiving messages
1. Check webhook URL is HTTPS (not HTTP)
2. Check .env variables are loaded
3. Check webhook token matches
4. Check firewall allows incoming requests
5. Check logs: `console.log('[Webhook]', ...)`

### Messages not sending
1. Check `WHATSAPP_TOKEN` is valid
2. Check `WHATSAPP_PHONE_NUMBER_ID` is correct
3. Check user's phone number format (should include country code)
4. Check rate limits not exceeded
5. Check console errors from `whatsappService`

### User not recognized
1. Check `BotUser.phone` matches incoming `message.from`
2. Check phone number format consistency (with/without +)
3. Check user registered via app first

### Insights not generating
1. Check `GEMINI_API_KEY` is valid
2. Check API quota not exhausted
3. Check user has data (water logs, carbon logs, or answers)
4. Check logs for Gemini errors

---

## 📞 Support

- Meta WhatsApp Docs: https://developers.facebook.com/docs/whatsapp
- Webhook Tester: In WhatsApp Console → Settings → Webhooks
- API Status: https://status.cloud.google.com (for Gemini)

---

**Next:** Deploy to production and start receiving messages! 🚀
