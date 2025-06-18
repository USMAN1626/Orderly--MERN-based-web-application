
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, restaurantName, restaurantUrl, password } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !phone || !restaurantName || !password) {
            return res.status(400).json({ message: 'All fields (First Name, Last Name, Email, Phone, Restaurant Name, Password) are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Check if email already registered
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(409).json({ message: 'Email already registered for a restaurant. Please use a different email.' });
        }

        // HASH THE PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new restaurant with hashed password
        const newRestaurant = new Restaurant({
            firstName,
            lastName,
            email,
            phone,
            restaurantName,
            restaurantUrl: restaurantUrl || '',
            password: hashedPassword
        });

        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant registered successfully. You can now login.' });
    } catch (err) {
        console.error('Restaurant registration server error:', err);
        res.status(500).json({ message: 'An internal server error occurred during restaurant registration.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find restaurant by email
        const restaurant = await Restaurant.findOne({ email });

        if (!restaurant) {
            return res.status(400).json({ message: 'Invalid credentials: Email not found.' });
        }


        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials: Incorrect password.' });
        }


        res.status(200).json({
            message: 'Login successful',
            restaurantId: restaurant._id,
            restaurantName: restaurant.restaurantName,
            email: restaurant.email
        });
    } catch (err) {
        console.error('Restaurant login server error:', err);
        res.status(500).json({ message: 'An internal server error occurred during restaurant login.' });
    }
};
