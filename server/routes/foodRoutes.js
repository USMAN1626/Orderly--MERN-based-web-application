const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const { 
    getAllFoodItems, 
    getRestaurantFoodItems,
    addFoodItem, 
    updateFoodItem, 
    deleteFoodItem 
} = require('../controllers/foodController');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Food routes are working' });
});

// Debug route to test restaurant ID
router.get('/debug/restaurant/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        console.log('Debug - Testing restaurant ID:', restaurantId);
        
        // Check if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            console.log('Debug - Invalid ObjectId format');
            return res.status(400).json({
                error: 'Invalid ObjectId format',
                id: restaurantId
            });
        }

        // Try to find the restaurant
        const restaurant = await Restaurant.findById(restaurantId);
        console.log('Debug - Restaurant lookup result:', restaurant ? 'Found' : 'Not found');
        
        if (!restaurant) {
            return res.status(404).json({
                error: 'Restaurant not found',
                id: restaurantId
            });
        }

        res.json({
            message: 'Restaurant found',
            restaurant: {
                id: restaurant._id,
                name: restaurant.restaurantName,
                email: restaurant.email
            }
        });
    } catch (error) {
        console.error('Debug - Error:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

// Test route to verify restaurant ID
router.get('/test-restaurant/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        console.log('Testing restaurant ID:', restaurantId);
        
        const restaurant = await Restaurant.findById(restaurantId);
        console.log('Restaurant found:', restaurant ? 'Yes' : 'No');
        
        if (!restaurant) {
            return res.status(404).json({
                message: 'Restaurant not found',
                restaurantId: restaurantId
            });
        }
        
        res.json({
            message: 'Restaurant found',
            restaurant: {
                id: restaurant._id,
                name: restaurant.restaurantName,
                email: restaurant.email
            }
        });
    } catch (error) {
        console.error('Error testing restaurant:', error);
        res.status(500).json({ message: 'Error testing restaurant', error: error.message });
    }
});

router.get('/', getAllFoodItems);
router.get('/restaurant/:restaurantId', getRestaurantFoodItems);
router.post('/', addFoodItem);
router.put('/:id', updateFoodItem);
router.delete('/:id', deleteFoodItem);

module.exports = router;
