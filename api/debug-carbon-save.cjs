const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CarbonLog = require('./models/CarbonLog');
const User = require('./models/User');
const { calculateCarbonFromInputs } = require('./utils/carbonCalculator');

async function testSave() {
    try {
        console.log('🔍 Connecting to DB...');
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);
        console.log('✅ Connected.');

        const user = await User.findOne({});
        if (!user) {
            console.log('❌ No users found to test with.');
            process.exit(1);
        }

        const testData = {
            month: 4,
            year: 2026,
            electricity_units: 100,
            food_type: 'veg',
            waste_kg: 10
        };

        console.log(`🧪 Testing save for User: ${user._id} | Month: ${testData.month}`);

        const calculations = calculateCarbonFromInputs(testData);
        
        // Try to find existing
        let log = await CarbonLog.findOne({ userId: user._id, month: testData.month, year: testData.year });
        
        if (log) {
            console.log('🔄 Existing log found, updating...');
            Object.assign(log, testData, calculations);
            await log.save();
            
            // USER UPDATE
            const scoreDifference = calculations.eco_score - (log.eco_score || 0);
            const addedPoints = Math.round(scoreDifference / 2);
            if(addedPoints !== 0) {
                console.log(`➕ Adding ${addedPoints} points to user...`);
                await User.findByIdAndUpdate(user._id, { $inc: { points: addedPoints } });
            }
            console.log('✅ Update successful!');
        } else {
            console.log('🆕 No log found, creating new...');
            log = new CarbonLog({
                userId: user._id,
                ...testData,
                ...calculations
            });
            await log.save();

            // USER UPDATE
            const addedPoints = Math.max(0, Math.round(calculations.eco_score / 2));
            console.log(`➕ Adding ${addedPoints} points to user and linking log...`);
            await User.findByIdAndUpdate(user._id, { 
                $inc: { points: addedPoints },
                $addToSet: { carbon_logs: log._id }
            });
            console.log('✅ Creation successful!');
        }

    } catch (err) {
        console.error('❌ ERROR DURING SAVE:', err);
    } finally {
        await mongoose.connection.close();
    }
}

testSave();
