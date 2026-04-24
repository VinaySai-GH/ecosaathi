const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const BotUser = require('../models/BotUser');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // 1. Delete users with unknown city except vinay
        const result = await User.deleteMany({
            $or: [
                { city: 'unknown city' },
                { city: { $exists: false } },
                { city: null }
            ],
            name: { $ne: 'vinay' }
        });
        console.log(`Deleted ${result.deletedCount} unknown users`);

        // 2. Set vinay's city to tirupati
        const vinay = await User.findOneAndUpdate(
            { name: 'vinay' },
            { $set: { city: 'tirupati' } },
            { new: true }
        );
        if (vinay) {
            console.log(`Updated vinay's city to: ${vinay.city}`);
        } else {
            console.log(`User 'vinay' not found`);
        }

        // 3. Remove orphaned BotUsers
        const allUsers = await User.find({}, '_id');
        const userIds = allUsers.map(u => u._id);
        const botResult = await BotUser.deleteMany({
            userId: { $nin: userIds }
        });
        console.log(`Deleted ${botResult.deletedCount} orphaned BotUsers`);

        console.log('Cleanup complete');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
}

cleanup();
