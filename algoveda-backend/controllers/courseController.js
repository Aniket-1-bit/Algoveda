const pool = require('../config/database');
const cache = require('../services/cacheService');

const getCourses = async (req, res, next) => {
  try {
    const cacheKey = 'courses:all';
    let result = cache.get(cacheKey);

    if (!result) {
      result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
      cache.set(cacheKey, result.rows, 600); // 10 minutes
    } else {
      result = { rows: result };
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `course:${id}`;
    let courseData = cache.get(cacheKey);

    if (!courseData) {
      const course = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

      if (course.rows.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const lessons = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index', [id]);

      courseData = {
        ...course.rows[0],
        lessons: lessons.rows,
      };

      cache.set(cacheKey, courseData, 600); // 10 minutes
    }

    res.json(courseData);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, difficulty_level, duration_hours, prerequisites } = req.body;
    const instructor_id = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO courses (title, description, instructor_id, difficulty_level, duration_hours, prerequisites) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description || '', instructor_id, difficulty_level || 'beginner', duration_hours || 0, prerequisites || '']
    );

    // Invalidate cache
    cache.delete('courses:all');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instructor_id = req.user.id;
    
    // Verify course exists and user is instructor
    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [id, instructor_id]);
    
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    
    // Delete associated lessons first (due to foreign key constraints)
    await pool.query('DELETE FROM lessons WHERE course_id = $1', [id]);
    
    // Delete associated quizzes (due to foreign key constraints)
    await pool.query(`
      DELETE FROM quizzes 
      WHERE lesson_id IN (
        SELECT id FROM lessons WHERE course_id = $1
      )
    `, [id]);
    
    // Delete associated course enrollments
    await pool.query('DELETE FROM course_enrollments WHERE course_id = $1', [id]);
    
    // Delete associated user progress
    await pool.query(`
      DELETE FROM user_progress 
      WHERE lesson_id IN (
        SELECT id FROM lessons WHERE course_id = $1
      )
    `, [id]);
    
    // Delete the course
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    
    // Invalidate cache
    cache.delete('courses:all');
    
    res.json({ message: 'Course and all associated data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourseById, createCourse, deleteCourse };
