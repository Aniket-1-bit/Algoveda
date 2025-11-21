const pool = require('../config/database');

// Initialize database schema
const initializeDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar_url VARCHAR(255),
        user_type VARCHAR(50) DEFAULT 'student', -- 'student' or 'mentor'
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor_id INTEGER REFERENCES users(id),
        difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
        duration_hours INTEGER,
        prerequisites TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Lessons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        order_index INTEGER,
        estimated_duration_minutes INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Gamification - Users XP and Levels
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_gamification (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
        total_xp INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        current_level_xp INTEGER DEFAULT 0,
        daily_streak INTEGER DEFAULT 0,
        last_active_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Badges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon_url VARCHAR(255),
        criteria JSONB,
        created_by_mentor_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User Badges (many-to-many)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        badge_id INTEGER NOT NULL REFERENCES badges(id),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      );
    `);

    // Progress tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        lesson_id INTEGER NOT NULL REFERENCES lessons(id),
        completed BOOLEAN DEFAULT FALSE,
        completion_percentage INTEGER DEFAULT 0,
        time_spent_minutes INTEGER DEFAULT 0,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);

    // Code submissions (for hands-on environment)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS code_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        lesson_id INTEGER REFERENCES lessons(id),
        code_content TEXT NOT NULL,
        language VARCHAR(50),
        status VARCHAR(50), -- 'submitted', 'passed', 'failed'
        test_results JSONB,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Quiz/LSS (Learning Sprint Sessions)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER NOT NULL REFERENCES lessons(id),
        title VARCHAR(255) NOT NULL,
        questions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Quiz Responses
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
        answers JSONB,
        score INTEGER,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Daily Challenges
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
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User Daily Progress
    await pool.query(`
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

    // Course Enrollments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES courses(id),
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        UNIQUE(user_id, course_id)
      );
    `);

    // Lesson Comments
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
    `);

    // Comment Likes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL REFERENCES lesson_comments(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
      );
    `);

    // Certificates
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES courses(id),
        certificate_id VARCHAR(255) UNIQUE NOT NULL,
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completion_percentage INTEGER,
        final_score INTEGER,
        pdf_url VARCHAR(255),
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifications
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        related_id INTEGER,
        read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };
