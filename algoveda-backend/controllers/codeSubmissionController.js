const pool = require('../config/database');
const { executeCode, validateCode } = require('../services/codeExecutor');

const submitCode = async (req, res, next) => {
  try {
    const { lesson_id, code_content, language } = req.body;
    const user_id = req.user.id;

    if (!code_content || !language) {
      return res.status(400).json({ message: 'code_content and language are required' });
    }

    // Validate code
    const validation = validateCode(code_content, language);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.error });
    }

    // Execute code
    const execution = await executeCode(code_content, language);

    // Save submission
    const result = await pool.query(
      'INSERT INTO code_submissions (user_id, lesson_id, code_content, language, status, test_results, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *',
      [
        user_id,
        lesson_id || null,
        code_content,
        language,
        execution.success ? 'passed' : 'failed',
        JSON.stringify(execution),
      ]
    );

    const submission = result.rows[0];

    // Award XP if passed
    if (execution.success) {
      await pool.query(
        'UPDATE user_gamification SET total_xp = total_xp + 100 WHERE user_id = $1',
        [user_id]
      );
    }

    res.status(201).json({
      id: submission.id,
      status: execution.success ? 'passed' : 'failed',
      output: execution.output,
      error: execution.error,
      xp_earned: execution.success ? 100 : 0,
      submission_id: submission.id,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      'SELECT * FROM code_submissions WHERE user_id = $1 ORDER BY submitted_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM code_submissions WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getLessonSubmissions = async (req, res, next) => {
  try {
    const { lesson_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM code_submissions WHERE user_id = $1 AND lesson_id = $2 ORDER BY submitted_at DESC',
      [user_id, lesson_id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, test_results } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      'UPDATE code_submissions SET status = COALESCE($1, status), test_results = COALESCE($2, test_results) WHERE id = $3 AND user_id = $4 RETURNING *',
      [status, test_results ? JSON.stringify(test_results) : null, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Award XP if test passed
    if (status === 'passed') {
      await pool.query(
        'UPDATE user_gamification SET total_xp = total_xp + 100 WHERE user_id = $1',
        [user_id]
      );
    }

    res.json({
      submission: result.rows[0],
      xp_earned: status === 'passed' ? 100 : 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitCode,
  getSubmissions,
  getSubmissionById,
  getLessonSubmissions,
  updateSubmissionStatus,
};
