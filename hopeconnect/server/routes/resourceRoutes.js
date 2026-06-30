// server/routes/resourceRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const { 
    createResource, 
    getAllResources, 
    updateResourceStatus,
    getActivityHistory,
    claimResource
} = require('../controllers/resourceController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { validateResource, checkValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// ─── LOCAL STORAGE CONFIGURATION FOR DISPATCH IMAGES ───
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Streams donation photos straight into your server's local uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, `resource-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 7 * 1024 * 1024 }, // Enforces a 7MB maximum image upload safety limitation
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for resource dispatches!'), false);
        }
    }
});

// All logistics actions running through this router require active coordinate authentication
router.use(protect);

// ─── CORE RESOURCE LOGISTICS PATHWAYS ───

// GET http://localhost:5001/api/resources
// Fetches unclaimed active allocations (Fixes the 404 console error)
router.get('/', getAllResources);

// POST http://localhost:5001/api/resources
// Logs a brand new physical supply entity with local image interception streaming
router.post(
    '/', 
    authorizeRoles('INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL'), 
    upload.single('image'), // Intercepts the raw photo packet from your React FormData stream
    validateResource, 
    checkValidationErrors, 
    createResource
);

// GET http://localhost:5001/api/resources/history
// Retrieves the logged audit trail coordinates for the timelines ledger
router.get('/history', getActivityHistory);

// POST http://localhost:5001/api/resources/:id/claim
// Express mapping to handle the explicit claim route triggered by your Claim buttons
router.post(
    '/:id/claim',
    authorizeRoles('NGO', 'HOSPITAL', 'OLD_AGE_HOME'),
    claimResource || updateResourceStatus
);

// PUT http://localhost:5001/api/resources/:id/status
// Retained legacy put action for universal status auditing modifications
router.put(
    '/:id/status', 
    authorizeRoles('NGO', 'HOSPITAL', 'OLD_AGE_HOME'), 
    updateResourceStatus
);

module.exports = router;