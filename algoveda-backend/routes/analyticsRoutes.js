const express = require('express');
const {
  getMentorAnalytics,
  getStudentGrowthChart,
  getEngagementMetrics,
} = require('../controllers/analyticsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['mentor']));

router.get('/dashboard', getMentorAnalytics);
router.get('/growth', getStudentGrowthChart);
router.get('/engagement', getEngagementMetrics);

module.exports = router;
