
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  restaurantName: {
    type: String,
    required: true
  },

  restaurantUrl: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
