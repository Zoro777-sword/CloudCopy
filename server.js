const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')('sk_test_51R5Wo4CRgXwrIeaENEIKxUAMtgwVGSO9VMYEAPi2XObs5Hdqcx2MhmqDYhKw1uqrwUk1sRqFZYHIh1REPFaOMyED003tTibdrZ');

dotenv.config();

// Configure CORS to allow all origins in development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.static('public')); // To serve your HTML
app.use(express.json());

// Constants
const MINIMUM_INR_AMOUNT = 50; // Minimum amount in INR (approximately $0.60 USD) to meet Stripe's 50 cent requirement

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body;
    const item = items[0]; // Get the first item
    
    try {
        // Calculate the actual total in paise (smallest unit)
        const actualTotal = Math.round(item.totalPrice * 100);
        
        // If the total is less than minimum required, set to minimum
        const finalTotal = Math.max(actualTotal, MINIMUM_INR_AMOUNT * 100);
        
        // Determine if we're using the minimum amount
        const isUsingMinimum = actualTotal < MINIMUM_INR_AMOUNT * 100;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `CloudCopy ${item.colorMode} Printout`,
                            description: `${item.pages} pages, ${item.orientation} orientation${isUsingMinimum ? ' (minimum charge applied)' : ''}`,
                        },
                        unit_amount: finalTotal,
                    },
                    quantity: 1, // Use quantity of 1 since we're setting the total price directly
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        // Send response with the session ID and info about minimum charge
        res.json({ 
            id: session.id,
            minimum_charge_applied: isUsingMinimum,
            actual_amount: item.totalPrice,
            charged_amount: finalTotal / 100
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));