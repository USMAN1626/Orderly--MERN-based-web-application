const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  restaurant: String,
  image: String,
}, { collection: 'foodbackend' }); // Explicitly define the collection name

// Specify the collection name 'foodbackend' explicitly
const Food = mongoose.model('Food', foodSchema, 'foodbackend');

// Export the model so it can be used elsewhere
module.exports = Food;
