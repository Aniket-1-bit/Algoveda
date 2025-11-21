const express = require('express');
const {
  submitCode,
  getSubmissions,
  getSubmissionById,
  getLessonSubmissions,
  updateSubmissionStatus,
} = require('../controllers/codeSubmissionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Submissions
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);
router.get('/lesson/:lesson_id', getLessonSubmissions);

// Submit and update
router.post('/', submitCode);
router.put('/:id/status', updateSubmissionStatus);

module.exports = router;
