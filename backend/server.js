const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const stripe = require('stripe')('sk_test_51R5Wo4CRgXwrIeaENEIKxUAMtgwVGSO9VMYEAPi2XObs5Hdqcx2MhmqDYhKw1uqrwUk1sRqFZYHIh1REPFaOMyED003tTibdrZ');

dotenv.config();

// Configure CORS to allow all origins in development
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Parse JSON bodies
app.use(express.json());

// Constants
const MINIMUM_INR_AMOUNT = 3; // Minimum amount in INR that converts to at least $0.50

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, paymentMethodId } = req.body;
        
        if (!items || !items.length) {
            return res.status(400).json({ error: 'No items provided' });
        }

        const item = items[0];
        
        // Calculate the actual total in paise (smallest unit)
        const actualTotal = Math.round(item.totalPrice * 100);
        
        // If the total is less than minimum required, set to minimum
        const finalTotal = Math.max(actualTotal, MINIMUM_INR_AMOUNT * 100);
        
        // Determine if we're using the minimum amount
        const isUsingMinimum = actualTotal < MINIMUM_INR_AMOUNT * 100;

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalTotal,
            currency: 'inr',
            payment_method: paymentMethodId,
            confirm: true,
            return_url: 'http://localhost:3000/success.html',
            metadata: {
                order_id: item.orderId || 'temp_order_id',
                color_mode: item.colorMode,
                pages: item.pages,
                orientation: item.orientation
            }
        });

        // Send response with the payment intent info
        res.json({ 
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            status: paymentIntent.status,
            minimum_charge_applied: isUsingMinimum,
            actual_amount: item.totalPrice,
            charged_amount: finalTotal / 100
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ 
            error: error.message,
            type: error.type,
            code: error.code
        });
    }
});

// Handle payment success
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/success.html'));
});

// Handle payment cancellation
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cancel.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Stripe integration is ready');
});