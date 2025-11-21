const express = require('express');
const { getCourses, getCourseById, createCourse } = require('../controllers/courseController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateToken, authorizeRole(['mentor']), createCourse);

module.exports = router;
