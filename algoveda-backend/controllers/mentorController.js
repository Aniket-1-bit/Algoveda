const pool = require('../config/database');

// Get mentor dashboard stats
const getMentorStats = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    // Get courses created
    const coursesResult = await pool.query('SELECT COUNT(*) as count FROM courses WHERE instructor_id = $1', [
      mentorId,
    ]);

    // Get total students across courses
    const studentsResult = await pool.query(
      'SELECT COUNT(DISTINCT ce.user_id) as count FROM course_enrollments ce JOIN courses c ON ce.course_id = c.id WHERE c.instructor_id = $1',
      [mentorId]
    );

    // Get average student performance
    const performanceResult = await pool.query(
      'SELECT AVG(completion_percentage) as avg_progress FROM user_progress up JOIN lessons l ON up.lesson_id = l.id JOIN courses c ON l.course_id = c.id WHERE c.instructor_id = $1',
      [mentorId]
    );

    res.json({
      courses_created: parseInt(coursesResult.rows[0].count),
      total_students: parseInt(studentsResult.rows[0].count),
      avg_student_progress: Math.round(performanceResult.rows[0].avg_progress || 0),
    });
  } catch (error) {
    next(error);
  }
};

// Get mentor's courses
const getMentorCourses = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    const result = await pool.query(
      `SELECT c.*, 
              (SELECT COUNT(DISTINCT user_id) FROM course_enrollments WHERE course_id = c.id) as student_count,
              (SELECT AVG(completion_percentage) FROM user_progress up JOIN lessons l ON up.lesson_id = l.id WHERE l.course_id = c.id) as avg_progress
       FROM courses c 
       WHERE c.instructor_id = $1 
       ORDER BY c.id ASC`,
      [mentorId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Get students in a course
const getCourseStudents = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id;

    // Verify ownership
    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [
      courseId,
      mentorId,
    ]);

    if (courseCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT u.id, u.username, u.full_name, u.email, 
              ce.enrolled_at, ce.completed,
              (SELECT COUNT(*) FROM user_progress where user_id = u.id AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)) as lessons_completed,
              (SELECT AVG(completion_percentage) FROM user_progress where user_id = u.id AND lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)) as avg_progress,
              g.total_xp, g.current_level
       FROM course_enrollments ce
       JOIN users u ON ce.user_id = u.id
       JOIN user_gamification g ON u.id = g.user_id
       WHERE ce.course_id = $1
       ORDER BY u.username`,
      [courseId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Award custom badge to student
const awardCustomBadge = async (req, res, next) => {
  try {
    const { studentId, badgeName, badgeDescription } = req.body;
    const mentorId = req.user.id;

    if (!studentId || !badgeName) {
      return res.status(400).json({ message: 'studentId and badgeName are required' });
    }

    // Create or find custom badge
    let badgeResult = await pool.query("SELECT id FROM badges WHERE name = $1 AND created_by_mentor_id = $2", [
      badgeName,
      mentorId,
    ]);

    let badgeId;
    if (badgeResult.rows.length === 0) {
      const createResult = await pool.query(
        'INSERT INTO badges (name, description, created_by_mentor_id) VALUES ($1, $2, $3) RETURNING id',
        [badgeName, badgeDescription || '', mentorId]
      );
      badgeId = createResult.rows[0].id;
    } else {
      badgeId = badgeResult.rows[0].id;
    }

    // Award badge
    await pool.query(
      'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [studentId, badgeId]
    );

    res.json({ message: 'Badge awarded successfully' });
  } catch (error) {
    next(error);
  }
};

// Award bonus XP to student
const awardBonusXP = async (req, res, next) => {
  try {
    const { studentId, xpAmount, reason } = req.body;
    const mentorId = req.user.id;

    if (!studentId || !xpAmount) {
      return res.status(400).json({ message: 'studentId and xpAmount are required' });
    }

    if (xpAmount < 0 || xpAmount > 500) {
      return res.status(400).json({ message: 'XP amount must be between 0 and 500' });
    }

    await pool.query(
      'UPDATE user_gamification SET total_xp = total_xp + $1 WHERE user_id = $2',
      [xpAmount, studentId]
    );

    // Log the action (for future audit)
    console.log(`Mentor ${mentorId} awarded ${xpAmount} XP to student ${studentId}. Reason: ${reason || 'N/A'}`);

    res.json({
      message: `${xpAmount} XP awarded successfully`,
      xp_awarded: xpAmount,
    });
  } catch (error) {
    next(error);
  }
};

// Create custom quiz for class
const createClassQuiz = async (req, res, next) => {
  try {
    const { lessonId, title, questions, dueDate } = req.body;
    const mentorId = req.user.id;

    if (!lessonId || !title || !questions) {
      return res.status(400).json({ message: 'lessonId, title, and questions are required' });
    }

    // Verify ownership
    const lessonCheck = await pool.query(
      'SELECT l.* FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1 AND c.instructor_id = $2',
      [lessonId, mentorId]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO quizzes (lesson_id, title, questions) VALUES ($1, $2, $3) RETURNING *',
      [lessonId, title, JSON.stringify(questions)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get detailed student performance
const getStudentPerformance = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;
    const mentorId = req.user.id;

    // Verify ownership
    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1 AND instructor_id = $2', [
      courseId,
      mentorId,
    ]);

    if (courseCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get progress
    const progressResult = await pool.query(
      `SELECT l.id, l.title, up.completed, up.completion_percentage, up.time_spent_minutes
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.course_id = $2
       ORDER BY l.order_index`,
      [studentId, courseId]
    );

    // Get quiz performance
    const quizResult = await pool.query(
      `SELECT q.id, q.title, qr.score, qr.submitted_at
       FROM quizzes q
       LEFT JOIN quiz_responses qr ON q.id = qr.quiz_id AND qr.user_id = $1
       WHERE q.lesson_id IN (SELECT id FROM lessons WHERE course_id = $2)
       ORDER BY qr.submitted_at DESC`,
      [studentId, courseId]
    );

    // Get code submissions
    const codeResult = await pool.query(
      `SELECT cs.id, cs.status, cs.submitted_at, l.title
       FROM code_submissions cs
       JOIN lessons l ON cs.lesson_id = l.id
       WHERE cs.user_id = $1 AND l.course_id = $2
       ORDER BY cs.submitted_at DESC`,
      [studentId, courseId]
    );

    res.json({
      lessons: progressResult.rows,
      quizzes: quizResult.rows,
      code_submissions: codeResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get all quizzes created by a mentor
const getMentorQuizzes = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    // Get all courses taught by this mentor
    const coursesResult = await pool.query(
      'SELECT id FROM courses WHERE instructor_id = $1',
      [mentorId]
    );

    const courseIds = coursesResult.rows.map(course => course.id);

    if (courseIds.length === 0) {
      return res.json([]);
    }

    // Get all lessons from these courses
    const lessonsResult = await pool.query(
      'SELECT id FROM lessons WHERE course_id = ANY($1)',
      [courseIds]
    );

    const lessonIds = lessonsResult.rows.map(lesson => lesson.id);

    if (lessonIds.length === 0) {
      return res.json([]);
    }

    // Get all quizzes for these lessons
    const quizzesResult = await pool.query(
      `SELECT q.*, l.title as lesson_title, l.course_id, c.title as course_title
       FROM quizzes q
       JOIN lessons l ON q.lesson_id = l.id
       JOIN courses c ON l.course_id = c.id
       WHERE q.lesson_id = ANY($1)
       ORDER BY q.created_at DESC`,
      [lessonIds]
    );

    // Parse questions if they are stored as JSON string
    const quizzes = quizzesResult.rows.map(quiz => {
      if (typeof quiz.questions === 'string') {
        try {
          quiz.questions = JSON.parse(quiz.questions);
        } catch (e) {
          console.error('Error parsing quiz questions:', e);
        }
      }
      return quiz;
    });

    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

const getMentorChallenges = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    
    const result = await pool.query(
      'SELECT dc.*, u.username as created_by_name FROM daily_challenges dc JOIN users u ON dc.created_by = u.id WHERE dc.created_by = $1 ORDER BY dc.created_date DESC',
      [mentorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMentorStats,
  getMentorCourses,
  getMentorChallenges,
  getCourseStudents,
  awardCustomBadge,
  awardBonusXP,
  createClassQuiz,
  getStudentPerformance,
  getMentorQuizzes,
};
