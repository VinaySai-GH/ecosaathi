const axios = require('axios');

/**
 * WhatsApp Service — Handles communication with Meta Graph API
 */

const WHATSAPP_TOKEN           = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION              = 'v20.0'; // Stable version

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

/**
 * Send a simple text message
 */
exports.sendTextMessage = async (to, text) => {
    try {
        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
            console.error('[WhatsApp] Missing credentials in .env');
            return null;
        }

        const res = await axios.post(
            BASE_URL,
            {
                messaging_product: 'whatsapp',
                recipient_type:    'individual',
                to:                to,
                type:              'text',
                text:              { body: text },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(`[WhatsApp] Message sent successfully to ${to}`);
        return res.data;
    } catch (error) {
        console.error('❌ [WhatsApp] SEND FAILED!');
        console.error('To:', to);
        console.error('Error Details:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Send a message with quick reply buttons (Max 3 buttons)
 * Currently using for single-question flows if needed.
 */
exports.sendButtons = async (to, text, buttons) => {
    try {
        const res = await axios.post(
            BASE_URL,
            {
                messaging_product: 'whatsapp',
                recipient_type:    'individual',
                to:                to,
                type:              'interactive',
                interactive: {
                    type: 'button',
                    body: { text },
                    action: {
                        buttons: buttons.map((btn, i) => ({
                            type: 'reply',
                            reply: { id: `btn_${i}`, title: btn },
                        })),
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('[WhatsApp] Send buttons error:', error.response?.data || error.message);
        throw error;
    }
};
