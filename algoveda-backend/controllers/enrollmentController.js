const pool = require('../config/database');

// Create enrollment table migration (should be run once)
const createEnrollmentTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES courses(id),
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        UNIQUE(user_id, course_id)
      )
    `);
  } catch (error) {
    console.error('Error creating enrollment table:', error);
  }
};

const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    // Check if course exists
    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const result = await pool.query(
      'INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [userId, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getUserEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT c.*, ce.enrolled_at, ce.completed, ce.completed_at FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id WHERE ce.user_id = $1 ORDER BY ce.enrolled_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getCourseEnrollmentStatus = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (result.rows.length === 0) {
      return res.json({ enrolled: false });
    }

    res.json({
      enrolled: true,
      enrollment: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const completeCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE course_enrollments SET completed = true, completed_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND course_id = $2 RETURNING *',
      [userId, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Award 200 XP for course completion
    await pool.query(
      'UPDATE user_gamification SET total_xp = total_xp + 200 WHERE user_id = $1',
      [userId]
    );

    // Try to award completion badge
    const badgeResult = await pool.query(
      'SELECT id FROM badges WHERE name ILIKE $1',
      ['%completion%']
    );

    if (badgeResult.rows.length > 0) {
      await pool.query(
        'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, badgeResult.rows[0].id]
      );
    }

    res.json({
      message: 'Course completed!',
      enrollment: result.rows[0],
      xp_earned: 200,
    });
  } catch (error) {
    next(error);
  }
};

const unenrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    res.json({ message: 'Unenrolled from course' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollmentTable,
  enrollCourse,
  getUserEnrollments,
  getCourseEnrollmentStatus,
  completeCourse,
  unenrollCourse,
};
