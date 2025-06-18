const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Food', foodSchema); 