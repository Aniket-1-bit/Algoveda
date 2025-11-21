const express = require('express');
const {
  createComment,
  getCommentsByLesson,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public route - get comments
router.get('/lesson/:lesson_id', getCommentsByLesson);

// Protected routes
router.use(authenticateToken);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.post('/like', likeComment);
router.post('/unlike', unlikeComment);

module.exports = router;
