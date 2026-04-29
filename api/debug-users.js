const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const BotUser = require('./models/BotUser');

async function debug() {
    try {
        console.log('🔍 Connecting to DB to check users...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        const users = await BotUser.find({}).limit(10);
        console.log('\n--- REGISTERED BOT USERS (First 10) ---');
        users.forEach(u => {
            console.log(`User: ${u.userId} | Phone: "${u.phone}" | Time: ${u.preferred_time}`);
        });
        console.log('---------------------------------------\n');

        if (users.length === 0) {
            console.log('⚠️  NO USERS REGISTERED FOR THE BOT YET!');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

debug();
