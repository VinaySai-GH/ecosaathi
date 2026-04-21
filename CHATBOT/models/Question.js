const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  // food / water / transport / waste / nature
  category: {
    type: String,
    required: true,
    enum: ['food', 'water', 'transport', 'waste', 'nature']
  }
});

module.exports = mongoose.model('Question', questionSchema);
