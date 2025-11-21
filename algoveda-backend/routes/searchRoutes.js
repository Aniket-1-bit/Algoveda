const express = require('express');
const { searchCourses, getSuggestedCourses, getPopularCourses, getTrendingCourses } = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/courses', searchCourses);
router.get('/popular', getPopularCourses);
router.get('/trending', getTrendingCourses);
router.get('/suggested', getSuggestedCourses);

module.exports = router;
