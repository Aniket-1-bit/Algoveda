const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        console.log('🌱 Seeding admin user...');

        const adminPassword = await bcrypt.hash('admin123', 10);
        const email = 'admin@algoveda.com';

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name, user_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) 
       DO UPDATE SET user_type = 'admin', password_hash = $3
       RETURNING *`,
            ['admin', email, adminPassword, 'System Administrator', 'admin']
        );

        console.log('✅ Admin user created/updated successfully');
        console.log(`   Email: ${result.rows[0].email}`);
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
