const express = require('express');
const {
  enrollCourse,
  getUserEnrollments,
  getCourseEnrollmentStatus,
  completeCourse,
  unenrollCourse,
} = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All enrollment routes require authentication
router.use(authenticateToken);

// User enrollments
router.get('/', getUserEnrollments);
router.get('/:courseId/status', getCourseEnrollmentStatus);

// Enroll and manage
router.post('/', enrollCourse);
router.post('/:courseId/complete', completeCourse);
router.delete('/:courseId', unenrollCourse);

module.exports = router;
