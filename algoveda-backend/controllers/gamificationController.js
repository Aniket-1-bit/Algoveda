const pool = require('../config/database');
const cache = require('../services/cacheService');

// Get user stats
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM user_gamification WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        user_id: userId,
        total_xp: 0,
        current_level: 1,
        current_level_xp: 0,
        daily_streak: 0,
        last_active_date: null,
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get user badges
const getUserBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT b.*, ub.earned_at FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = $1 ORDER BY ub.earned_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Get all available badges
const getAllBadges = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Award badge to user
const awardBadge = async (req, res, next) => {
  try {
    const { badgeId } = req.body;
    const userId = req.user.id;

    if (!badgeId) {
      return res.status(400).json({ message: 'badgeId is required' });
    }

    const result = await pool.query(
      'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [userId, badgeId]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Badge already earned' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Calculate and update level based on XP
const calculateLevel = (xp) => {
  let level = 1;
  let requiredXp = 1000; // Base XP for level 2

  while (xp >= requiredXp) {
    xp -= requiredXp;
    level++;
    requiredXp = Math.floor(requiredXp * 1.15); // 15% growth
    if (level > 10) break; // Max level 10
  }

  return { level, currentLevelXp: xp };
};

// Update user XP
const updateUserXP = async (req, res, next) => {
  try {
    const { xpAmount } = req.body;
    const userId = req.user.id;

    if (!xpAmount || xpAmount <= 0) {
      return res.status(400).json({ message: 'Valid xpAmount required' });
    }

    // Get current XP
    const current = await pool.query(
      'SELECT total_xp FROM user_gamification WHERE user_id = $1',
      [userId]
    );

    if (current.rows.length === 0) {
      // Initialize if not exists
      await pool.query(
        'INSERT INTO user_gamification (user_id, total_xp, current_level) VALUES ($1, $2, $3)',
        [userId, xpAmount, 1]
      );
    } else {
      const newXp = current.rows[0].total_xp + xpAmount;
      const { level } = calculateLevel(newXp);

      await pool.query(
        'UPDATE user_gamification SET total_xp = $1, current_level = $2 WHERE user_id = $3',
        [newXp, level, userId]
      );
    }

    // Invalidate leaderboard cache
    cache.invalidatePattern('leaderboard:*');

    const result = await pool.query(
      'SELECT * FROM user_gamification WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update daily streak
const updateDailyStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      'SELECT * FROM user_gamification WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_gamification (user_id, daily_streak, last_active_date) VALUES ($1, $2, $3)',
        [userId, 1, today]
      );
      return res.status(201).json({ daily_streak: 1 });
    }

    const user = result.rows[0];
    const lastActive = user.last_active_date?.toISOString().split('T')[0];

    let newStreak = user.daily_streak || 0;
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActive === yesterdayStr) {
        newStreak++;
      } else {
        newStreak = 1; // Reset if missed a day
      }

      await pool.query(
        'UPDATE user_gamification SET daily_streak = $1, last_active_date = $2 WHERE user_id = $3',
        [newStreak, today, userId]
      );
    }

    res.json({ daily_streak: newStreak });
  } catch (error) {
    next(error);
  }
};

// Get leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const cacheKey = `leaderboard:${limit}`;
    let result = cache.get(cacheKey);

    if (!result) {
      result = await pool.query(
        'SELECT u.id, u.username, u.full_name, u.avatar_url, g.total_xp, g.current_level FROM user_gamification g JOIN users u ON g.user_id = u.id WHERE u.user_type = $1 ORDER BY g.total_xp DESC LIMIT $2',
        ['student', parseInt(limit)]
      );
      cache.set(cacheKey, result.rows, 300); // 5 minutes
    } else {
      result = { rows: result };
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserStats,
  getUserBadges,
  getAllBadges,
  awardBadge,
  updateUserXP,
  updateDailyStreak,
  getLeaderboard,
};
