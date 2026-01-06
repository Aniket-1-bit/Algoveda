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

module.exports = {
    getAllUsers,
    updateUserRole,
    getStats
};
