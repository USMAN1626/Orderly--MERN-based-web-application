require('dotenv').config();
const express = require('express');
const router = express.Router();

// Debug: Log environment variables
console.log('Environment variables loaded:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing');

// Initialize Stripe with the secret key from environment variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});
const Receipt = require('../models/Receipt');

console.log('Payment routes initialized');

// Test endpoint to verify the route is working
router.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Payment route is working' });
});

// Create payment intent endpoint
router.post('/create-payment-intent', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const { amount } = req.body;

        // Validate amount
        if (!amount) {
            console.error('Amount is missing');
            return res.status(400).json({ error: "Amount is required" });
        }

        if (typeof amount !== 'number') {
            console.error('Invalid amount type:', typeof amount);
            return res.status(400).json({ error: "Amount must be a number" });
        }

        if (amount <= 0) {
            console.error('Invalid amount value:', amount);
            return res.status(400).json({ error: "Amount must be greater than 0" });
        }

        // Ensure amount is in cents (integer)
        const amountInCents = Math.round(amount);
        console.log('Creating payment intent for amount in cents:', amountInCents);

        // Create the payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('Payment intent created successfully:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        // Log the full error
        console.error('Stripe Payment Error:', {
            message: error.message,
            type: error.type,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ error: error.message });
    }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        try {
            // Get order details from metadata
            const orderDetails = JSON.parse(paymentIntent.metadata.orderDetails);
            
            // Create new receipt
            const receipt = new Receipt({
                ...orderDetails,
                paymentIntentId: paymentIntent.id,
                status: 'completed'
            });

            await receipt.save();
            console.log('Order saved to database:', receipt._id);
        } catch (err) {
            console.error('Error saving order:', err);
        }
    }

    res.json({received: true});
});

// Log all registered routes
console.log('Payment routes registered:');
console.log('- GET /test');
console.log('- POST /create-payment-intent');
console.log('- POST /webhook');

module.exports = router; 