// server/middlewares/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// 1. Define the validation rules for Registration
exports.validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number'),
    body('role')
        .isIn(['ADMIN', 'INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL', 'NGO', 'OLD_AGE_HOME'])
        .withMessage('Invalid role specified')
];

exports.validateResource = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['FOOD', 'FUNDS', 'MEDICAL_SUPPLY']).withMessage('Invalid resource type'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('isEmergency').optional().isBoolean().withMessage('isEmergency must be a boolean')
];

// 2. Middleware to catch and return validation errors
exports.checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return a 400 Bad Request with the specific errors
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};