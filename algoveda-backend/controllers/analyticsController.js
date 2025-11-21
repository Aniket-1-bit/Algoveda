const pool = require('../config/database');
const cache = require('../services/cacheService');

const getMentorAnalytics = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const cacheKey = `mentor_analytics:${mentorId}`;
    let analytics = cache.get(cacheKey);

    if (!analytics) {
      const courseStats = await pool.query(
        'SELECT COUNT(*) as total_courses FROM courses WHERE instructor_id = $1',
        [mentorId]
      );

      const studentStats = await pool.query(
        'SELECT COUNT(DISTINCT ce.user_id) as total_students FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id WHERE c.instructor_id = $1',
        [mentorId]
      );

      analytics = {
        courses: courseStats.rows[0],
        students: studentStats.rows[0],
      };

      cache.set(cacheKey, analytics, 1800);
    }

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

const getStudentGrowthChart = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const days = parseInt(req.query.days) || 30;

    const data = await pool.query(
      `SELECT DATE(ce.enrolled_at) as date, COUNT(*) as new_students
       FROM course_enrollments ce
       JOIN courses c ON ce.course_id = c.id
       WHERE c.instructor_id = $1
       GROUP BY DATE(ce.enrolled_at)
       ORDER BY date ASC`,
      [mentorId]
    );

    res.json(data.rows);
  } catch (error) {
    next(error);
  }
};

const getEngagementMetrics = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    const metrics = {
      activeStudents: 0,
      discussions: { total_comments: 0 },
      codeSubmissions: { total_submissions: 0, pass_rate: 0 },
    };

    res.json(metrics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMentorAnalytics,
  getStudentGrowthChart,
  getEngagementMetrics,
};
