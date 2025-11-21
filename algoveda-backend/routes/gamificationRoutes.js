const express = require('express');
const {
  getUserStats,
  getUserBadges,
  getAllBadges,
  awardBadge,
  updateUserXP,
  updateDailyStreak,
  getLeaderboard,
} = require('../controllers/gamificationController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/badges', getAllBadges);

// Protected routes
router.use(authenticateToken);
router.get('/stats', getUserStats);
router.get('/my-badges', getUserBadges);
router.post('/badges/award', awardBadge);
router.post('/xp/update', updateUserXP);
router.post('/streak/update', updateDailyStreak);

module.exports = router;
