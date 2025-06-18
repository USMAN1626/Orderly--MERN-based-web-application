const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Log environment variables (without exposing sensitive data)
console.log('Environment variables loaded:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing');

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the client's public directory
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
app.use('/img', express.static(path.join(__dirname, '../client/public/img')));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Import routes
console.log('Loading routes...');
const customerRoutes = require('./routes/customerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
console.log('Routes loaded successfully');

// Mount routes
console.log('Mounting routes...');
app.use('/api/customer', customerRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/fooditems', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Test route to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

console.log('Routes mounted successfully');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

mongoose.connect('mongodb://localhost:27017/hotel-app')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- /api/customer');
    console.log('- /api/restaurant');
    console.log('- /api/fooditems');
    console.log('- /api/cart');
    console.log('- /api/receipt');
    console.log('- /api/payment');
    console.log('- /api/analytics');
    console.log('- /api/test');
});
