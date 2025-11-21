const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name, user_type } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, user_type',
      [username, email, hashedPassword, full_name || '', user_type || 'student']
    );

    // Initialize gamification record for student
    if (user_type !== 'mentor') {
      await pool.query(
        'INSERT INTO user_gamification (user_id, total_xp, current_level) VALUES ($1, $2, $3)',
        [result.rows[0].id, 0, 1]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  // In JWT-based systems, logout is handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
