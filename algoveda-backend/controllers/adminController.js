const pool = require('../config/database');

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let queryText = 'SELECT id, username, email, full_name, user_type, created_at FROM users';
        const queryParams = [];

        if (search) {
            queryText += ' WHERE username ILIKE $1 OR email ILIKE $1 OR full_name ILIKE $1';
            queryParams.push(`%${search}%`);
        }

        // Get total count
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM users ${search ? 'WHERE username ILIKE $1 OR email ILIKE $1 OR full_name ILIKE $1' : ''}`,
            queryParams
        );
        const totalUsers = parseInt(countResult.rows[0].count);

        // Add ordering and pagination
        queryText += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const result = await pool.query(queryText, queryParams);

        res.json({
            users: result.rows,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            totalUsers,
        });
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_type } = req.body;

        if (!['student', 'mentor', 'admin'].includes(user_type)) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        const result = await pool.query(
            'UPDATE users SET user_type = $1 WHERE id = $2 RETURNING id, username, email, user_type',
            [user_type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User role updated successfully',
            user: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = {};

        const userStats = await pool.query(`
      SELECT user_type, COUNT(*) as count 
      FROM users 
      GROUP BY user_type
    `);

        userStats.rows.forEach(row => {
            stats[`${row.user_type}Count`] = parseInt(row.count);
        });

        const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
        stats.totalCourses = parseInt(courseCount.rows[0].count);

        const submissionSettings = await pool.query('SELECT COUNT(*) FROM code_submissions');
        stats.totalSubmissions = parseInt(submissionSettings.rows[0].count);

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const bcrypt = require('bcryptjs');

const addUser = async (req, res, next) => {
    try {
        const { username, email, password, full_name, user_type } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Validate user type
        if (!['student', 'mentor', 'admin'].includes(user_type)) {
            return res.status(400).json({ message: 'Invalid user type. Must be student, mentor, or admin' });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User with this username or email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, full_name, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, full_name, user_type, created_at',
            [username, email, hashedPassword, full_name || null, user_type]
        );

        // Initialize gamification record for the new user
        if (user_type !== 'admin') {
            await pool.query(
                'INSERT INTO user_gamification (user_id, total_xp, current_level) VALUES ($1, $2, $3)',
                [result.rows[0].id, 0, 1]
            );
        }

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

const sendAlert = async (req, res, next) => {
    try {
        const { title, message, priority } = req.body;
        const adminId = req.user.id; // Assuming authenticateToken middleware adds user info to req

        // Validate required fields
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        // Validate priority
        const validPriorities = ['low', 'normal', 'high', 'urgent'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority. Must be low, normal, high, or urgent' });
        }

        // Get all user IDs to send notifications to
        const usersResult = await pool.query('SELECT id FROM users');
        const userIds = usersResult.rows.map(user => user.id);

        // Insert notification for each user
        const notificationPromises = userIds.map(userId => {
            return pool.query(
                'INSERT INTO notifications (user_id, type, title, message, read) VALUES ($1, $2, $3, $4, $5)',
                [userId, `alert_${priority}`, title, message, false]
            );
        });

        await Promise.all(notificationPromises);

        res.status(201).json({
            message: `${userIds.length} alerts sent successfully`,
            count: userIds.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    getStats,
    addUser,
    sendAlert
};
