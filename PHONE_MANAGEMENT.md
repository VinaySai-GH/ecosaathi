# 📞 Phone Number Management Guide
**How to add new numbers and manage multiple WhatsApp accounts**

---

## Quick Summary

| Scenario | What to do |
|----------|-----------|
| **Add new business phone number** | Request from Meta in WhatsApp Console |
| **Add new user to receive messages** | User registers in EcoSaathi app |
| **Switch business number** | Update `WHATSAPP_PHONE_NUMBER_ID` in .env |
| **Support multiple business numbers** | Update webhook handler (see below) |
| **User changes their phone number** | They re-register in app with new number |

---

## 📱 Scenario 1: Add a New Business Phone Number

**Why?** To have a dedicated number for different regions/purposes.

### Steps:
1. Open **Meta Business Suite** → **WhatsApp** → **Settings**
2. Go to **Phone Numbers**
3. Click **"Add number"**
4. Choose:
   - **Request a new number** (Meta provides) OR
   - **Add existing number** (you provide)
5. Enter details:
   - Display name: `EcoSaathi Tirupati`
   - Category: `Education`
6. Click **Add**
7. **Verify** the number (SMS code will be sent)
8. Once verified:
   - Get **Phone Number ID** → save as `WHATSAPP_PHONE_NUMBER_ID_2`
   - Generate **new Access Token** → save as `WHATSAPP_TOKEN_2`
   - Update your code to use both

---

## 👤 Scenario 2: Add a New User to Receive Messages

**Who can receive messages?** Only users registered in the EcoSaathi app.

### User's steps:
1. Open EcoSaathi app
2. Sign up / Log in with phone number (e.g., `+919876543210`)
3. Go to Dashboard → "Join Raat Ka Hisaab"
4. Select preferred time (21:00, 21:30, 22:00)
5. Click **Register**
6. Open WhatsApp
7. Search for business number (e.g., `+1 (123) 456-7890`)
8. Send message: `Hi` or `Hello`
9. Bot responds: "Welcome! You're registered. First question coming tomorrow."

### Backend flow:
```
User registers in app
    ↓
BotUser.create({ userId, phone: "+919876543210", preferred_time: "21:00" })
    ↓
Tomorrow at 21:00:
    ↓
Bot sends: "🌙 Did you reduce water usage today? Reply Y/N/Hmm"
    ↓
User replies from WhatsApp: "Y"
    ↓
Webhook receives message with from="+919876543210"
    ↓
Look up in BotUser by phone → found!
    ↓
Process answer → award points → send response
```

---

## 🔄 Scenario 3: Support Multiple Business Phone Numbers

**Why?** If you have different numbers for different regions.

### Setup:
1. Add multiple numbers in Meta (see Scenario 1)
2. Get multiple `WHATSAPP_PHONE_NUMBER_ID` values
3. In `.env`, store all:
   ```env
   WHATSAPP_TOKEN_TIRUPATI=token1
   WHATSAPP_PHONE_NUMBER_ID_TIRUPATI=123456
   
   WHATSAPP_TOKEN_HYDERABAD=token2
   WHATSAPP_PHONE_NUMBER_ID_HYDERABAD=789012
   ```

4. Update webhook handler:
   ```javascript
   // api/controllers/bot.controller.js
   
   exports.handleWebhook = async (req, res) => {
       try {
           const { entry } = req.body;
           const phoneNumberId = entry[0].changes[0].value.metadata.phone_number_id;
           
           // Determine which region based on phone number ID
           let whatsappService;
           if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID_TIRUPATI) {
               whatsappService = new WhatsAppServiceTirupati();
           } else if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID_HYDERABAD) {
               whatsappService = new WhatsAppServiceHyderabad();
           }
           
           // Process message...
       } catch (error) {
           console.error('Webhook error:', error);
           res.status(200).json({ received: true });
       }
   };
   ```

---

## 🔀 Scenario 4: User Changes Their Phone Number

**What happens?** They need to re-register.

### Steps:
1. User's old phone: `+919876543210` (registered as BotUser)
2. User gets new phone: `+919999999999`
3. User logs into app with NEW number
4. App creates new User account
5. User goes to Dashboard → clicks "Join Raat Ka Hisaab"
6. Creates NEW BotUser with new phone number
7. Old BotUser becomes inactive (optional: delete or archive)

**Note:** Old and new accounts are separate. Points don't transfer.

---

## 🎯 Scenario 5: Switch to a Different Business Phone Number

**Why?** You want to use a different WhatsApp number.

### Steps:
1. In Meta console, get the NEW phone number's details:
   - Phone Number ID
   - Access Token (generate new)

2. Update `.env`:
   ```env
   WHATSAPP_TOKEN=NEW_TOKEN_HERE
   WHATSAPP_PHONE_NUMBER_ID=NEW_PHONE_NUMBER_ID_HERE
   ```

3. Restart backend
4. Update in Meta:
   - Webhook should still point to `/api/bot/webhook`
   - It will automatically use the new credentials from .env

5. **Tell users:** New business number
   - Via in-app notification
   - Via email
   - Update website/docs

**All existing BotUsers keep their account** — they just message the new business number.

---

## 📊 Database Structure

Understanding how phone numbers are stored:

### User Collection:
```javascript
{
    _id: ObjectId,
    name: "Vinay Sai",
    phone: "+919876543210",        // PERSONAL phone (user's actual number)
    city: "Tirupati",
    points: 250,
    ...
}
```

### BotUser Collection:
```javascript
{
    _id: ObjectId,
    userId: ObjectId,              // Reference to User
    phone: "+919876543210",        // Copy of User.phone (used for lookup)
    preferred_time: "21:00",
    streak: 5,
    last_answered: Date,
    ...
}
```

### Webhook Message:
```javascript
{
    entry: [{
        changes: [{
            value: {
                metadata: {
                    phone_number_id: "123456789012345"  // BUSINESS phone ID (constant)
                },
                messages: [{
                    from: "+919876543210",              // USER's personal phone
                    text: { body: "Y" },
                    timestamp: "1234567890"
                }]
            }
        }]
    }]
}
```

**Key difference:**
- `phone_number_id` = Which business number message came FROM (constant per number)
- `from` = User's personal phone number (variable per user)

---

## ⚙️ Configuration Examples

### Single Business Number (Default):
```env
WHATSAPP_TOKEN=ABCd1234xyz789
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_WEBHOOK_TOKEN=ecosaathi_bot_secret_2024
```

### Multiple Business Numbers:
```env
# Tirupati Number
WHATSAPP_TOKEN_TIRUPATI=ABCd1234xyz789
WHATSAPP_PHONE_NUMBER_ID_TIRUPATI=111111111111111

# Hyderabad Number
WHATSAPP_TOKEN_HYDERABAD=XYZabc5678def901
WHATSAPP_PHONE_NUMBER_ID_HYDERABAD=222222222222222

# Webhook secret (shared across all numbers)
WHATSAPP_WEBHOOK_TOKEN=ecosaathi_bot_secret_2024
```

---

## 🧪 Testing Phone Number Setup

### Test 1: Verify webhook receives message
```bash
curl -X POST http://localhost:5000/api/bot/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "metadata": { "phone_number_id": "123456789012345" },
          "messages": [{
            "from": "919876543210",
            "text": { "body": "Y" }
          }]
        }
      }]
    }]
  }'
```

Expected: `{ "received": true }`

### Test 2: Check BotUser lookup
```bash
# In MongoDB:
db.botusers.findOne({ phone: "919876543210" })
# Should return the user if registered
```

### Test 3: Send message via API
```bash
curl -X POST http://localhost:5000/api/bot/test-send \
  -H "Content-Type: application/json" \
  -d '{ "phone": "919876543210", "message": "Hello test" }'
```

---

## 📋 Checklist: Adding a New Phone Number

- [ ] Request new number in Meta WhatsApp Console
- [ ] Verify the number (SMS code)
- [ ] Get Phone Number ID
- [ ] Generate Access Token
- [ ] Add to `.env`:
  - `WHATSAPP_TOKEN=...`
  - `WHATSAPP_PHONE_NUMBER_ID=...`
- [ ] Restart backend
- [ ] Test webhook receives messages
- [ ] Tell users about new number
- [ ] Monitor for messages in logs

---

## 🆘 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| User not recognized | Phone format mismatch | Ensure consistent format (with/without +) |
| Message not sending | Wrong phone ID | Verify `WHATSAPP_PHONE_NUMBER_ID` in .env |
| Webhook not processing | Number ID not registered | Check Meta console, update webhook |
| Multiple numbers conflict | Same token used | Generate separate token per number |

---

## 🚀 Production Deployment

When adding a new business number for production:

1. Get new credentials from Meta
2. Add to production `.env` file
3. Deploy backend
4. Wait for webhook to stabilize (up to 5 mins)
5. Send test message via WhatsApp
6. Confirm message received in logs
7. Announce to users

---

**Need help?** Check `WHATSAPP_SETUP.md` for full Meta account setup.