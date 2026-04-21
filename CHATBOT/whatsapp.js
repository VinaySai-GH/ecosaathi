const axios = require('axios');

// Send a plain text WhatsApp message
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`📤 Sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send to ${to}:`, error.response?.data || error.message);
  }
}

module.exports = { sendMessage };
