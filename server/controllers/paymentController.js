// server/controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../config/db');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create a Payment Order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to create payment order" });
    }
};

// 2. Verify Payment Signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, resourceId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is legit. Log the transaction in the database.
            await prisma.auditLog.create({
                data: {
                    action: 'FUNDS_DONATED',
                    description: `Payment ID ${razorpay_payment_id} verified successfully.`,
                    resourceId: resourceId,
                    userId: req.user.id
                }
            });

            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ error: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ error: "Payment verification failed" });
    }
};