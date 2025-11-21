const pool = require('../config/database');

const createCommentsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lesson_comments (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        parent_comment_id INTEGER REFERENCES lesson_comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS comment_likes (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL REFERENCES lesson_comments(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
      );
    `);
  } catch (error) {
    console.error('Error creating comments table:', error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { lesson_id, content, parent_comment_id } = req.body;
    const user_id = req.user.id;

    if (!lesson_id || !content || content.trim().length === 0) {
      return res.status(400).json({ message: 'lesson_id and content are required' });
    }

    if (content.length > 5000) {
      return res.status(400).json({ message: 'Comment is too long (max 5000 characters)' });
    }

    const result = await pool.query(
      'INSERT INTO lesson_comments (lesson_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [lesson_id, user_id, parent_comment_id || null, content]
    );

    const comment = result.rows[0];

    // Fetch user info
    const userResult = await pool.query('SELECT username, full_name, avatar_url FROM users WHERE id = $1', [user_id]);

    res.status(201).json({
      ...comment,
      user: userResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsByLesson = async (req, res, next) => {
  try {
    const { lesson_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    // Get top-level comments
    const result = await pool.query(
      `SELECT lc.*, u.username, u.full_name, u.avatar_url,
              (SELECT COUNT(*) FROM comment_likes WHERE comment_id = lc.id) as like_count
       FROM lesson_comments lc
       JOIN users u ON lc.user_id = u.id
       WHERE lc.lesson_id = $1 AND lc.parent_comment_id IS NULL AND lc.is_deleted = FALSE
       ORDER BY lc.created_at DESC
       LIMIT $2 OFFSET $3`,
      [lesson_id, limit, offset]
    );

    // Get replies for each comment
    const comments = await Promise.all(
      result.rows.map(async (comment) => {
        const repliesResult = await pool.query(
          `SELECT rc.*, u.username, u.full_name, u.avatar_url,
                  (SELECT COUNT(*) FROM comment_likes WHERE comment_id = rc.id) as like_count
           FROM lesson_comments rc
           JOIN users u ON rc.user_id = u.id
           WHERE rc.parent_comment_id = $1 AND rc.is_deleted = FALSE
           ORDER BY rc.created_at ASC`,
          [comment.id]
        );

        return {
          ...comment,
          replies: repliesResult.rows,
        };
      })
    );

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'content is required' });
    }

    // Verify ownership
    const commentCheck = await pool.query('SELECT * FROM lesson_comments WHERE id = $1', [id]);

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE lesson_comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Verify ownership
    const commentCheck = await pool.query('SELECT * FROM lesson_comments WHERE id = $1', [id]);

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('UPDATE lesson_comments SET is_deleted = TRUE WHERE id = $1', [id]);

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const { comment_id } = req.body;
    const user_id = req.user.id;

    if (!comment_id) {
      return res.status(400).json({ message: 'comment_id is required' });
    }

    const result = await pool.query(
      'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [comment_id, user_id]
    );

    // Update like count
    const likeCount = await pool.query(
      'SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = $1',
      [comment_id]
    );

    res.json({ liked: result.rows.length > 0, like_count: parseInt(likeCount.rows[0].count) });
  } catch (error) {
    next(error);
  }
};

const unlikeComment = async (req, res, next) => {
  try {
    const { comment_id } = req.body;
    const user_id = req.user.id;

    if (!comment_id) {
      return res.status(400).json({ message: 'comment_id is required' });
    }

    await pool.query('DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2', [comment_id, user_id]);

    // Get updated like count
    const likeCount = await pool.query(
      'SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = $1',
      [comment_id]
    );

    res.json({ liked: false, like_count: parseInt(likeCount.rows[0].count) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCommentsTable,
  createComment,
  getCommentsByLesson,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
