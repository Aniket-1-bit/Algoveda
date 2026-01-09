const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getAllUsers, updateUserRole, getStats, addUser, sendAlert } = require('../controllers/adminController');

// All routes require authentication and 'admin' role
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

router.get('/users', getAllUsers);
router.post('/users', addUser);
router.post('/alerts', sendAlert);
router.put('/users/:id/role', updateUserRole);
router.get('/stats', getStats);

module.exports = router;
