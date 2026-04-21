const mongoose = require('mongoose');

// One session = one night = one set of 3 questions sent to a user
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  date: { type: Date, default: Date.now },

  // The 3 question IDs that were sent tonight
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  // ['Y', 'N', 'H'] — filled in when user replies
  answers: [{ type: String, enum: ['Y', 'N', 'H'] }],

  // Whether the user has replied tonight
  answered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema);
