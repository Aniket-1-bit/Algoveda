const express = require('express');
const {
  getUserProgress,
  getLessonProgress,
  startLesson,
  updateProgress,
  completeLesson,
  getCourseProgress,
} = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User progress
router.get('/', getUserProgress);
router.get('/course/:courseId', getCourseProgress);
router.get('/:userId/:lessonId', getLessonProgress);

// Start and track progress
router.post('/start', startLesson);
router.put('/:lessonId', updateProgress);
router.post('/:lessonId/complete', completeLesson);

module.exports = router;
