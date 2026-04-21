// Run this once: npm run seed
// Loads all 195 questions into MongoDB

require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const questions = require('./questions');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared old questions');

    // Insert all 195
    await Question.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} questions successfully`);

    // Quick summary by category
    const counts = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('\nQuestions per category:');
    counts.forEach(c => console.log(`  ${c._id}: ${c.count}`));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done. Database disconnected.');
  }
}

seed();
