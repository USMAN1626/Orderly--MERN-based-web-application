// server/controllers/customerController.js

const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Receipt = require('../models/Receipt');
const mongoose = require('mongoose');

// Nodemailer setup (keep this in mind for later, you'll need to configure it with actual credentials)
// For a simple example with Gmail:
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your actual email
        pass: 'your-app-password' // Replace with your generated app password
    },
    // Added TLS settings for some environments, might not be strictly necessary for Gmail but good practice
    tls: {
        rejectUnauthorized: false
    }
});

mongoose.connect('mongodb://localhost:27017/hotel-app');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        // Check if email already registered
        const existing = await Customer.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered. Please use a different email or login.' }); // 409 Conflict
        }


        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new customer with hashed password
        const customer = new Customer({
            username,
            email,
            password: hashedPassword
        });

        await customer.save();
        res.status(201).json({ message: 'Customer registered successfully. Please login.' });
    } catch (err) {
        console.error('Customer signup server error:', err);

        res.status(500).json({ message: 'An internal server error occurred during signup.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(400).json({ message: 'Invalid credentials: Email not found.' });
        }


        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials: Incorrect password.' });
        }


        res.status(200).json({ message: 'Login successful', customerId: customer._id, email: customer.email });
    } catch (err) {
        console.error('Customer login server error:', err);
        res.status(500).json({ message: 'An internal server error occurred during login.' });
    }
};


// FIX: Uncommented these functions
exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });
        if (!customer) return res.status(404).json({ message: 'Email not found' });

        const token = crypto.randomBytes(32).toString('hex');
        customer.resetToken = token;
        customer.resetTokenExpiry = Date.now() + 3600000;
        await customer.save();

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const mailOptions = {
            to: email,
            from: 'your-email@gmail.com', // REMINDER: Replace with your actual email
            subject: 'Password Reset Request for Food Delivery App',
            html: `
                <p>You requested a password reset for your Food Delivery App account.</p>
                <p>Please click on the following link to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        // This part will cause an error if transporter is not correctly configured
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Nodemailer email sending error:', error);
                // Be careful not to expose too much internal error info to the client
                return res.status(500).json({ message: 'Failed to send password reset email. Check server configuration.', error: error.message });
            }
            res.status(200).json({ message: 'Password reset link sent to your email.' });
        });
    } catch (err) {
        console.error('Reset password request server error:', err);
        res.status(500).json({ message: 'An internal server error occurred during password reset request.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const customer = await Customer.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is not expired
        });

        if (!customer) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // HASH THE NEW PASSWORD before saving
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(newPassword, salt);

        customer.resetToken = undefined;
        customer.resetTokenExpiry = undefined;
        await customer.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Reset password server error:', err);
        res.status(500).json({ message: 'An internal server error occurred during password reset.' });
    }
};

exports.getRestaurantOrders = async (req, res) => {
    try {
        const orders = await Receipt.find({ restaurantId: req.params.restaurantId });
        res.status(200).json({ orders });
    } catch (err) {
        console.error('Error getting restaurant orders:', err);
        res.status(500).json({ message: 'An internal server error occurred while getting restaurant orders.' });
    }
};
