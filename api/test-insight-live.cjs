const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const insightsService = require('./services/insights.service');

async function testInsight() {
    console.log('🧪 Connecting to MongoDB...');
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in .env');

        await mongoose.connect(uri);
        
        const user = await User.findOne();
        if (!user) {
            console.log('❌ No user found in DB to test with!');
            return;
        }

        console.log(`🧪 Testing Insight for: ${user.name}...`);
        const result = await insightsService.getOrGenerateInsight(user._id, true); // force=true to bypass cache
        
        console.log('-------------------');
        console.log('✅ INSIGHT RECEIVED:');
        console.log(result.insight);
        console.log('-------------------');

    } catch (e) {
        console.error('❌ TEST FAILED:', e.message);
    } finally {
        await mongoose.connection.close();
    }
}

testInsight();
