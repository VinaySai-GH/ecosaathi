const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const users = await User.find({});
        console.log(`Checking ${users.length} users...`);

        let updatedCount = 0;

        for (const user of users) {
            let phone = user.phone.trim();
            
            // If it's exactly 10 digits, add '91'
            if (phone.length === 10 && /^\d+$/.test(phone)) {
                const newPhone = '91' + phone;
                console.log(`Updating ${user.name}: ${phone} -> ${newPhone}`);
                
                user.phone = newPhone;
                await user.save();
                updatedCount++;
            }
        }

        console.log(`✅ Migration complete! Updated ${updatedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
