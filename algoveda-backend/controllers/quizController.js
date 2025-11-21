const pool = require('../config/database');

const createQuiz = async (req, res, next) => {
  try {
    const { lessonId, title, questions } = req.body;

    if (!lessonId || !title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'lessonId, title, and questions are required' });
    }

    // Verify lesson exists and user is instructor
    const lessonCheck = await pool.query(
      'SELECT l.* FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = $1',
      [lessonId]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (lessonCheck.rows[0].instructor_id !== req.user.id) {
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

const getQuizByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query('SELECT * FROM quizzes WHERE lesson_id = $1', [lessonId]);

    if (result.rows.length === 0) {
      return res.json(null);
    }

    // Parse questions
    const quiz = result.rows[0];
    quiz.questions = typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions;
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

const submitQuizResponse = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    if (!quizId || !answers) {
      return res.status(400).json({ message: 'quizId and answers are required' });
    }

    // Get quiz
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = quizResult.rows[0];
    const questions = typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions;

    // Calculate score
    let correct = 0;
    for (const answer of Object.entries(answers)) {
      const [questionId, selectedAnswer] = answer;
      const question = questions.find((q) => q.id == questionId);
      if (question && selectedAnswer === question.correct_answer) {
        correct++;
      }
    }

    const score = Math.round((correct / questions.length) * 100);

    // Save response
    const result = await pool.query(
      'INSERT INTO quiz_responses (user_id, quiz_id, answers, score) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, quizId, JSON.stringify(answers), score]
    );

    // Award XP if passed (70% or higher)
    if (score >= 70) {
      await pool.query(
        'UPDATE user_gamification SET total_xp = total_xp + 30 WHERE user_id = $1',
        [userId]
      );

      // Award bonus for perfect score
      if (score === 100) {
        await pool.query(
          'UPDATE user_gamification SET total_xp = total_xp + 50 WHERE user_id = $1',
          [userId]
        );
      }
    }

    res.status(201).json({
      response: result.rows[0],
      score,
      xp_earned: score >= 70 ? (score === 100 ? 80 : 30) : 0,
      passed: score >= 70,
    });
  } catch (error) {
    next(error);
  }
};

const getUserQuizResponses = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM quiz_responses WHERE user_id = $1 AND quiz_id = $2 ORDER BY submitted_at DESC',
      [userId, quizId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getBestQuizScore = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT MAX(score) as best_score FROM quiz_responses WHERE user_id = $1 AND quiz_id = $2',
      [userId, quizId]
    );

    res.json({
      best_score: result.rows[0].best_score || 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuiz,
  getQuizByLesson,
  submitQuizResponse,
  getUserQuizResponses,
  getBestQuizScore,
};
