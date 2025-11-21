const express = require('express');
const {
  createQuiz,
  getQuizByLesson,
  submitQuizResponse,
  getUserQuizResponses,
  getBestQuizScore,
} = require('../controllers/quizController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public route - get quiz without auth
router.get('/lesson/:lessonId', getQuizByLesson);

// Protected routes
router.use(authenticateToken);
router.post('/submit', submitQuizResponse);
router.get('/:quizId/responses', getUserQuizResponses);
router.get('/:quizId/best-score', getBestQuizScore);

// Mentor only - create quiz
router.post('/', authorizeRole(['mentor']), createQuiz);

module.exports = router;
