// server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/conversations', messageController.getConversations);
router.get('/', messageController.getMessages);
router.post('/', messageController.sendMessage);

module.exports = router;
