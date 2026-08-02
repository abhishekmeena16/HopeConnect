// server/routes/integrationRoutes.js
const express = require('express');
const { upload } = require('../config/cloudinary');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ensure all these actions are taken by authenticated users
router.use(protect);

// -- Cloudinary Route --
// Expects a form-data field named 'document'
router.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    res.status(200).json({ 
        message: "File uploaded successfully", 
        url: req.file.path // The secure Cloudinary URL
    });
});

// -- Razorpay Routes --
router.post('/payment/create', createOrder);
router.post('/payment/verify', verifyPayment);

module.exports = router;