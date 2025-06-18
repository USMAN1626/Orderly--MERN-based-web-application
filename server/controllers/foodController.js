const Food = require('../models/foodModel');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

exports.getAllFoodItems = async (req, res) => {
    try {
        const items = await Food.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching food items', error: err });
    }
};

exports.getRestaurantFoodItems = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        console.log('Fetching food items for restaurant:', restaurantId);
        
        // Validate restaurantId format
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            console.log('Invalid restaurant ID format:', restaurantId);
            return res.status(400).json({ message: 'Invalid restaurant ID format' });
        }

        // Check if restaurant exists
        console.log('Looking up restaurant in database...');
        const restaurant = await Restaurant.findById(restaurantId);
        console.log('Restaurant lookup result:', restaurant ? 'Found' : 'Not found');
        
        if (!restaurant) {
            console.log('Restaurant not found:', restaurantId);
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find food items for this restaurant
        console.log('Searching for food items...');
        const items = await Food.find({ restaurant: restaurantId });
        console.log('Found items:', items);
        
        res.status(200).json(items);
    } catch (err) {
        console.error('Error in getRestaurantFoodItems:', err);
        res.status(500).json({ message: 'Error fetching restaurant food items', error: err.message });
    }
};

exports.addFoodItem = async (req, res) => {
    try {
        const { name, price, restaurant, imageUrl } = req.body;
        
        // Validate restaurant ID
        if (!mongoose.Types.ObjectId.isValid(restaurant)) {
            return res.status(400).json({ message: 'Invalid restaurant ID format' });
        }

        // Check if restaurant exists
        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const newFood = new Food({ name, price, restaurant, imageUrl });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        console.error('Error adding food item:', err);
        res.status(500).json({ message: 'Error adding food item', error: err.message });
    }
};

exports.updateFoodItem = async (req, res) => {
    try {
        const { name, price, imageUrl } = req.body;
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            { name, price, imageUrl },
            { new: true }
        );
        if (!updatedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json(updatedFood);
    } catch (err) {
        console.error('Error updating food item:', err);
        res.status(500).json({ message: 'Error updating food item', error: err.message });
    }
};

exports.deleteFoodItem = async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (err) {
        console.error('Error deleting food item:', err);
        res.status(500).json({ message: 'Error deleting food item', error: err.message });
    }
};
