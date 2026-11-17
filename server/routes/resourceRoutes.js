// server/routes/resourceRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const { 
    createResource, 
    getAllResources, 
    getEmergencyResources,
    updateResourceStatus,
    getActivityHistory,
    claimResource,
    getImpactAnalytics
} = require('../controllers/resourceController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { validateResource, checkValidationErrors } = require('../middlewares/validationMiddleware');

const router = express.Router();

// ─── LOCAL STORAGE CONFIGURATION FOR DISPATCH IMAGES ───
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `resource-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 7 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for resource dispatches!'), false);
        }
    }
});

// All logistics actions require authentication
router.use(protect);

// ─── CORE RESOURCE ROUTES ───
router.get('/', getAllResources);
router.get('/emergency', getEmergencyResources);
router.get('/analytics', getImpactAnalytics);
router.get('/history', getActivityHistory);

// POST /api/resources (Logs new donation)
router.post(
    '/', 
    authorizeRoles('INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL', 'ADMIN'), 
    upload.single('image'), 
    validateResource, 
    checkValidationErrors, 
    createResource
);

// POST /api/resources/:id/claim
router.post(
    '/:id/claim',
    authorizeRoles('NGO', 'HOSPITAL', 'OLD_AGE_HOME', 'ADMIN'),
    claimResource
);

// PUT /api/resources/:id/status (Participant updates delivery state)
router.put(
    '/:id/status', 
    authorizeRoles('INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL', 'NGO', 'OLD_AGE_HOME', 'ADMIN'), 
    updateResourceStatus
);

module.exports = router;