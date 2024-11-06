const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const router = express.Router();
const { client } = require('../util/Paypal'); // Import the PayPal client


// Route to create a PayPal order for a course
router.post('/create-course-payment', async (req, res) => {
    const { courseId, userId, coursename, price } = req.body;

    // Get course details from the database
    // You might replace this with a database call
    const course = {
        id: courseId,
        title: coursename,
        price: price // Example price in USD
    };

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    // Define the payment order details
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: course.price
            },
            description: course.title,
            custom_id: `${courseId}_${userId}` // Track the course and user
        }]
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
        console.log('Order created successfully', order.result);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error creating order', error);
    }
});

// Route to capture payment after approval
router.post('/capture-course-payment', async (req, res) => {
    const { orderId } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    try {
        const capture = await client.execute(request);
        res.json({ capture: capture.result });
        console.log('Payment captured successfully', capture.result);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error('Error capturing payment', error);
    }
});

module.exports = router;
