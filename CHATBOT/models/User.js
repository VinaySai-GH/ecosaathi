const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: '' },

  // Conversation state machine
  // new → waiting_name → waiting_time → active
  state: { type: String, default: 'new' },

  // "21:00" / "21:30" / "22:00"
  preferredTime: { type: String, default: '' },

  // Streak tracking
  streak: { type: Number, default: 0 },
  lastAnsweredDate: { type: Date, default: null },

  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
