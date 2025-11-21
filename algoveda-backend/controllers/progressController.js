const pool = require('../config/database');

const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY started_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getLessonProgress = async (req, res, next) => {
  try {
    const { userId, lessonId } = req.params;
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      // Return default progress if not started
      return res.json({
        user_id: userId,
        lesson_id: lessonId,
        completed: false,
        completion_percentage: 0,
        time_spent_minutes: 0,
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const startLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    // Check if already started
    const existing = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    const result = await pool.query(
      'INSERT INTO user_progress (user_id, lesson_id, started_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *',
      [userId, lessonId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { completion_percentage, time_spent_minutes } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE user_progress SET completion_percentage = COALESCE($1, completion_percentage), time_spent_minutes = COALESCE($2, time_spent_minutes), updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 AND lesson_id = $4 RETURNING *',
      [completion_percentage, time_spent_minutes, userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const completeLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE user_progress SET completed = true, completed_at = CURRENT_TIMESTAMP, completion_percentage = 100 WHERE user_id = $1 AND lesson_id = $2 RETURNING *',
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Award XP for lesson completion
    await pool.query(
      'UPDATE user_gamification SET total_xp = total_xp + 50 WHERE user_id = $1',
      [userId]
    );

    res.json({
      message: 'Lesson completed!',
      progress: result.rows[0],
      xp_earned: 50,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Get all lessons in course
    const lessonsResult = await pool.query(
      'SELECT id FROM lessons WHERE course_id = $1',
      [courseId]
    );

    const totalLessons = lessonsResult.rows.length;

    // Get user progress on all lessons
    const progressResult = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = ANY($2)',
      [userId, lessonsResult.rows.map(l => l.id)]
    );

    const completedLessons = progressResult.rows.filter(p => p.completed).length;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      course_id: courseId,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      completion_percentage: completionPercentage,
      progress_details: progressResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProgress,
  getLessonProgress,
  startLesson,
  updateProgress,
  completeLesson,
  getCourseProgress,
};
