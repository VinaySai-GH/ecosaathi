const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const whatsappService = require('./services/whatsapp.service');

const TEST_PHONE = '918919492311'; // User's number

async function test() {
    console.log('Testing WhatsApp credentials...');
    console.log('Phone ID:', process.env.WHATSAPP_PHONE_NUMBER_ID);
    console.log('Token starts with:', process.env.WHATSAPP_TOKEN?.substring(0, 10) + '...');

    try {
        const res = await whatsappService.sendTextMessage(TEST_PHONE, 'Test from EcoSaathi Server! 🌿');
        console.log('✅ Success! WhatsApp responded:', JSON.stringify(res));
    } catch (err) {
        console.error('❌ Failed to send message.');
        if (err.response) {
            console.error('Meta API Error:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Error:', err.message);
        }
    }
}

test();
