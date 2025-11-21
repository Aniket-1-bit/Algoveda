const pool = require('../config/database');

const searchCourses = async (req, res, next) => {
  try {
    const {
      query = '',
      difficulty = null,
      minDuration = null,
      maxDuration = null,
      instructor = null,
      sortBy = 'title',
      limit = 20,
      offset = 0,
    } = req.query;

    let sql = `
      SELECT c.*, 
             COUNT(DISTINCT ce.user_id) as enrollment_count,
             AVG(g.total_xp) as avg_student_xp
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      LEFT JOIN user_gamification g ON ce.user_id = g.user_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    // Search query
    if (query && query.trim()) {
      sql += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    // Difficulty filter
    if (difficulty) {
      sql += ` AND c.difficulty_level = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    // Duration filters
    if (minDuration !== null) {
      sql += ` AND c.duration_hours >= $${paramIndex}`;
      params.push(parseInt(minDuration));
      paramIndex++;
    }

    if (maxDuration !== null) {
      sql += ` AND c.duration_hours <= $${paramIndex}`;
      params.push(parseInt(maxDuration));
      paramIndex++;
    }

    // Instructor filter
    if (instructor) {
      sql += ` AND c.instructor_id = $${paramIndex}`;
      params.push(parseInt(instructor));
      paramIndex++;
    }

    // Sorting
    const validSortFields = ['title', 'created_at', 'enrollment_count', 'duration_hours'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'title';
    sql += ` GROUP BY c.id ORDER BY c.${sortField} DESC`;

    // Pagination
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) FROM courses c WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (query && query.trim()) {
      countSql += ` AND (c.title ILIKE $${countIndex} OR c.description ILIKE $${countIndex})`;
      countParams.push(`%${query}%`);
      countIndex++;
    }

    if (difficulty) {
      countSql += ` AND c.difficulty_level = $${countIndex}`;
      countParams.push(difficulty);
      countIndex++;
    }

    if (minDuration !== null) {
      countSql += ` AND c.duration_hours >= $${countIndex}`;
      countParams.push(parseInt(minDuration));
      countIndex++;
    }

    if (maxDuration !== null) {
      countSql += ` AND c.duration_hours <= $${countIndex}`;
      countParams.push(parseInt(maxDuration));
      countIndex++;
    }

    if (instructor) {
      countSql += ` AND c.instructor_id = $${countIndex}`;
      countParams.push(parseInt(instructor));
      countIndex++;
    }

    const countResult = await pool.query(countSql, countParams);

    res.json({
      courses: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].count),
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestedCourses = async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);

    let sql = 'SELECT * FROM courses ORDER BY created_at DESC LIMIT $1';
    const params = [limit];

    // If user is logged in, show personalized suggestions
    if (user_id) {
      sql = `
        SELECT DISTINCT c.* FROM courses c
        WHERE c.id NOT IN (
          SELECT course_id FROM course_enrollments WHERE user_id = $1
        )
        ORDER BY c.created_at DESC
        LIMIT $2
      `;
      params.unshift(user_id);
    }

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getPopularCourses = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await pool.query(
      `SELECT c.*, COUNT(ce.id) as enrollment_count
       FROM courses c
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id
       GROUP BY c.id
       ORDER BY enrollment_count DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getTrendingCourses = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const days = parseInt(req.query.days) || 30;

    const result = await pool.query(
      `SELECT c.*, COUNT(ce.id) as recent_enrollments
       FROM courses c
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id 
         AND ce.enrolled_at > NOW() - INTERVAL '${days} days'
       GROUP BY c.id
       ORDER BY recent_enrollments DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchCourses,
  getSuggestedCourses,
  getPopularCourses,
  getTrendingCourses,
};
