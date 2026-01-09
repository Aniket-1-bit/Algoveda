const express = require('express');
const {
  getTodayChallenge,
  submitChallengeAttempt,
  createChallenge,
  getChallengeSolution,
  getAllChallenges,
} = require('../controllers/challengeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/today', authenticateToken, getTodayChallenge);

// Protected routes
router.use(authenticateToken);
router.post('/submit', submitChallengeAttempt);
router.get('/:challengeId/solution', getChallengeSolution);

// Mentor only
router.post('/', authorizeRole(['mentor']), createChallenge);
router.get('/', authorizeRole(['mentor']), getAllChallenges);

module.exports = router;
