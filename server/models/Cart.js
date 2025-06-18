
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  foodName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true, unique: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
