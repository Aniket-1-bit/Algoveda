const pool = require('../config/database');

// Initialize daily challenges table if needed
const initializeChallengesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_challenges (
        id SERIAL PRIMARY KEY,
        created_by INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(50),
        code_template TEXT,
        test_cases JSONB,
        solution TEXT,
        xp_reward INTEGER DEFAULT 50,
        created_date DATE DEFAULT CURRENT_DATE,
        active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS user_daily_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        challenge_id INTEGER NOT NULL REFERENCES daily_challenges(id),
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        attempts INTEGER DEFAULT 0,
        UNIQUE(user_id, challenge_id)
      );
    `);
  } catch (error) {
    console.error('Error initializing challenges table:', error);
  }
};

const getTodayChallenge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Get today's challenge
    const result = await pool.query(
      'SELECT * FROM daily_challenges WHERE created_date = $1 AND active = true LIMIT 1',
      [today]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No challenge available today' });
    }

    const challenge = result.rows[0];

    // Check if user completed today's challenge
    const progressResult = await pool.query(
      'SELECT * FROM user_daily_progress WHERE user_id = $1 AND challenge_id = $2',
      [userId, challenge.id]
    );

    const completed = progressResult.rows.length > 0 && progressResult.rows[0].completed;

    res.json({
      ...challenge,
      completed,
      solution: completed ? challenge.solution : null, // Only show solution if completed
    });
  } catch (error) {
    next(error);
  }
};

const submitChallengeAttempt = async (req, res, next) => {
  try {
    const { challengeId, code } = req.body;
    const userId = req.user.id;

    if (!challengeId || !code) {
      return res.status(400).json({ message: 'challengeId and code are required' });
    }

    // Get challenge
    const challengeResult = await pool.query('SELECT * FROM daily_challenges WHERE id = $1', [
      challengeId,
    ]);

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Update progress
    let progressResult = await pool.query(
      'SELECT * FROM user_daily_progress WHERE user_id = $1 AND challenge_id = $2',
      [userId, challengeId]
    );

    if (progressResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_daily_progress (user_id, challenge_id, attempts) VALUES ($1, $2, 1)',
        [userId, challengeId]
      );
    } else {
      const newAttempts = (progressResult.rows[0].attempts || 0) + 1;
      await pool.query(
        'UPDATE user_daily_progress SET attempts = $1 WHERE user_id = $2 AND challenge_id = $3',
        [newAttempts, userId, challengeId]
      );
    }

    // Simulate solution check (in production, run actual code)
    const passed = code.toLowerCase().includes(challengeResult.rows[0].solution?.toLowerCase() || '');

    if (passed) {
      // Mark as completed
      await pool.query(
        'UPDATE user_daily_progress SET completed = true, completed_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND challenge_id = $2',
        [userId, challengeId]
      );

      // Award XP
      const xpReward = challengeResult.rows[0].xp_reward || 50;
      await pool.query(
        'UPDATE user_gamification SET total_xp = total_xp + $1 WHERE user_id = $2',
        [xpReward, userId]
      );

      // Award streak bonus
      await pool.query('UPDATE user_gamification SET daily_streak = daily_streak + 20 WHERE user_id = $1', [
        userId,
      ]);
    }

    res.json({
      passed,
      xp_earned: passed ? challengeResult.rows[0].xp_reward || 50 : 0,
      message: passed ? 'Challenge completed! 🎉' : 'Not quite right. Try again!',
    });
  } catch (error) {
    next(error);
  }
};

const createChallenge = async (req, res, next) => {
  try {
    const { title, description, difficulty, code_template, test_cases, solution, xp_reward } =
      req.body;
    const createdBy = req.user.id;

    if (!title || !solution) {
      return res.status(400).json({ message: 'title and solution are required' });
    }

    const result = await pool.query(
      'INSERT INTO daily_challenges (created_by, title, description, difficulty, code_template, test_cases, solution, xp_reward) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        createdBy,
        title,
        description || '',
        difficulty || 'medium',
        code_template || '',
        test_cases ? JSON.stringify(test_cases) : null,
        solution,
        xp_reward || 50,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getChallengeSolution = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Check if user completed the challenge
    const progressResult = await pool.query(
      'SELECT * FROM user_daily_progress WHERE user_id = $1 AND challenge_id = $2 AND completed = true',
      [userId, challengeId]
    );

    if (progressResult.rows.length === 0) {
      return res.status(403).json({ message: 'Complete the challenge first to see the solution' });
    }

    const result = await pool.query('SELECT solution FROM daily_challenges WHERE id = $1', [
      challengeId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ solution: result.rows[0].solution });
  } catch (error) {
    next(error);
  }
};

const getAllChallenges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT dc.*, u.username as created_by_name FROM daily_challenges dc JOIN users u ON dc.created_by = u.id WHERE dc.created_by = $1 ORDER BY dc.created_date DESC',
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initializeChallengesTable,
  getTodayChallenge,
  submitChallengeAttempt,
  createChallenge,
  getChallengeSolution,
  getAllChallenges,
};
