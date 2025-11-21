const pool = require('../config/database');

const createNotificationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL, -- 'achievement', 'course_update', 'milestone', 'comment', 'badge'
        title VARCHAR(255) NOT NULL,
        message TEXT,
        related_id INTEGER, -- course_id, badge_id, etc.
        read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
    `);
  } catch (error) {
    console.error('Error creating notifications table:', error);
  }
};

const createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, title, message, related_id) VALUES ($1, $2, $3, $4, $5)',
      [userId, type, title, message, relatedId]
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getUserNotifications = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const unreadOnly = req.query.unread === 'true';

    let sql = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [user_id];
    let paramIndex = 2;

    if (unreadOnly) {
      sql += ` AND read = FALSE`;
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'UPDATE notifications SET read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    await pool.query(
      'UPDATE notifications SET read = TRUE, read_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND read = FALSE',
      [user_id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, user_id]);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query('SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = FALSE', [
      user_id,
    ]);

    res.json({ unread_count: parseInt(result.rows[0].count) });
  } catch (error) {
    next(error);
  }
};

// Notification triggers
const notifyAchievementUnlocked = async (userId, badgeName, courseTitle) => {
  await createNotification(userId, 'achievement', '🏆 Achievement Unlocked!', `You've earned the "${badgeName}" badge in ${courseTitle}`);
};

const notifyCourseCompleted = async (userId, courseTitle) => {
  await createNotification(userId, 'milestone', '🎉 Course Complete!', `Congratulations! You've completed ${courseTitle}`);
};

const notifyLevelUp = async (userId, newLevel) => {
  await createNotification(userId, 'milestone', '⭐ Level Up!', `You've reached Level ${newLevel}!`);
};

const notifyQuizPassed = async (userId, quizTitle, score) => {
  await createNotification(userId, 'achievement', '✅ Quiz Passed!', `You scored ${score}% on ${quizTitle}`);
};

const notifyNewComment = async (userId, commentAuthor, lessonTitle) => {
  await createNotification(userId, 'comment', '💬 New Reply', `${commentAuthor} replied to a comment on "${lessonTitle}"`);
};

module.exports = {
  createNotificationsTable,
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  notifyAchievementUnlocked,
  notifyCourseCompleted,
  notifyLevelUp,
  notifyQuizPassed,
  notifyNewComment,
};
