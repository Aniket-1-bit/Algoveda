const pool = require('../config/database');

const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query(
      'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC',
      [courseId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const lesson = result.rows[0];

    // Get associated quiz
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE lesson_id = $1', [id]);

    res.json({
      ...lesson,
      quiz: quizResult.rows[0] || null,
    });
  } catch (error) {
    next(error);
  }
};

const createLesson = async (req, res, next) => {
  try {
    const { title, description, content, course_id, order_index, estimated_duration_minutes } = req.body;

    if (!title || !course_id) {
      return res.status(400).json({ message: 'Title and course_id are required' });
    }

    // Verify course exists and user is instructor
    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1', [course_id]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (courseCheck.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized - you are not the course instructor' });
    }

    const result = await pool.query(
      'INSERT INTO lessons (title, description, content, course_id, order_index, estimated_duration_minutes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description || '', content || '', course_id, order_index || 1, estimated_duration_minutes || 30]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content, estimated_duration_minutes } = req.body;

    // Get lesson and verify ownership
    const lessonCheck = await pool.query(
      'SELECT l.* FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
      [id]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lessonCheck.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE lessons SET title = COALESCE($1, title), description = COALESCE($2, description), content = COALESCE($3, content), estimated_duration_minutes = COALESCE($4, estimated_duration_minutes), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, description, content, estimated_duration_minutes, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get lesson and verify ownership
    const lessonCheck = await pool.query(
      'SELECT l.* FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
      [id]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lessonCheck.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('DELETE FROM lessons WHERE id = $1', [id]);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
