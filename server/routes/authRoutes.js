// server/routes/authRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { validateRegistration, checkValidationErrors } = require('../middlewares/validationMiddleware');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware'); 

const router = express.Router();

// ─── CONFIGURE STORAGE WORKSPACE FOR MULTIPART AVATARS ───
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Saves files into the 'server/uploads' folder
    },
    filename: (req, file, cb) => {
        // Appends timestamp to prevent duplicate name conflicts
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limits files to 5MB maximum
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Authentication / Identity Routes
router.post('/register', validateRegistration, checkValidationErrors, register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ─── UPDATED: PROFILE INTERCEPTOR EXTENSION ───
// upload.single('avatar') matches the multiPartPayload.append('avatar', ...) field from your React state
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// System Operational Access Modules
router.get('/admin-dashboard', protect, authorizeRoles('ADMIN'), (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard" });
});

router.post('/log-surplus-food', protect, authorizeRoles('RESTAURANT', 'INDIVIDUAL_DONOR'), (req, res) => {
    res.status(200).json({ message: "Food logged successfully" });
});

module.exports = router;