// server/routes/aidRequestRoutes.js
const express = require('express');
const router = express.Router();
const aidRequestController = require('../controllers/aidRequestController');
const { protect } = require('../middlewares/authMiddleware');

// Public or protected browsing of active aid requests
router.get('/', protect, aidRequestController.getAllAidRequests);

// Create new aid request
router.post('/', protect, aidRequestController.createAidRequest);

// Fulfill aid request
router.post('/:id/fulfill', protect, aidRequestController.fulfillAidRequest);

// Cancel/Delete aid request
router.delete('/:id', protect, aidRequestController.deleteAidRequest);

module.exports = router;
