const express = require('express');
const {
  getMentorStats,
  getMentorCourses,
  getCourseStudents,
  awardCustomBadge,
  awardBonusXP,
  createClassQuiz,
  getStudentPerformance,
} = require('../controllers/mentorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All mentor routes require mentor role
router.use(authenticateToken, authorizeRole(['mentor']));

// Dashboard
router.get('/stats', getMentorStats);
router.get('/courses', getMentorCourses);
router.get('/courses/:courseId/students', getCourseStudents);
router.get('/courses/:courseId/students/:studentId/performance', getStudentPerformance);

// Rewards & incentives
router.post('/badges/award', awardCustomBadge);
router.post('/xp/award', awardBonusXP);

// Content management
router.post('/quizzes', createClassQuiz);

module.exports = router;
