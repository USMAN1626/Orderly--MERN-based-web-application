const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  items: [
    {
      foodName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
