const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool for database initialization
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  database: 'postgres' // Connect to default database first
});

const initializePostgres = async () => {
  try {
    console.log('🔍 Checking if database exists...');
    
    // Check if database exists
    const dbCheck = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME || 'algoveda'}'`
    );

    if (dbCheck.rows.length === 0) {
      console.log('📦 Creating database...');
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'algoveda'}`);
      console.log('✅ Database created successfully!');
    } else {
      console.log('✅ Database already exists!');
    }

    await pool.end();

    // Now connect to the actual database and initialize schema
    const appPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'algoveda'
    });

    console.log('🔧 Initializing database schema...');
    const { initializeDatabase } = require('../config/schema');
    await initializeDatabase();

    console.log('✅ Database initialization complete!');
    console.log('\n📝 Next step: Run "node scripts/seed.js" to add sample data\n');

    await appPool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\n⚠️  Make sure:');
    console.error('1. PostgreSQL is installed and running');
    console.error('2. .env file has correct credentials');
    console.error('3. PostgreSQL user has database creation permissions\n');
    process.exit(1);
  }
};

initializePostgres();
