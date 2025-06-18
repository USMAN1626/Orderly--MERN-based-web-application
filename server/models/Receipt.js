
const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  streetAddress: String,
  city: String,
  phone: String,
  email: String,
  totalPrice: Number,
  cart: [
    {
      foodName: String,
      quantity: Number,
      price: Number,
    },
  ],

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Receipt', receiptSchema);
