const express = require('express');
const {
  getMentorStats,
  getMentorCourses,
  getMentorChallenges,
  getCourseStudents,
  awardCustomBadge,
  awardBonusXP,
  createClassQuiz,
  getStudentPerformance,
  getMentorQuizzes,
} = require('../controllers/mentorController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { deleteCourse } = require('../controllers/courseController');

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
router.get('/quizzes', getMentorQuizzes);
router.get('/challenges', getMentorChallenges);

// Course management
router.delete('/courses/:id', deleteCourse);

module.exports = router;
