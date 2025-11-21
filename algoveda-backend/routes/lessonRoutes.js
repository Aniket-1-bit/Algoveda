const express = require('express');
const {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);

// Protected routes (mentor only)
router.post('/', authenticateToken, authorizeRole(['mentor']), createLesson);
router.put('/:id', authenticateToken, authorizeRole(['mentor']), updateLesson);
router.delete('/:id', authenticateToken, authorizeRole(['mentor']), deleteLesson);

module.exports = router;
