const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL for Render deployment
let dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'algoveda',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

// If DATABASE_URL is provided (Render style), parse it
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 5432,
      database: url.pathname.substring(1), // Remove leading slash
      user: url.username,
      password: url.password,
    };
    console.log('Using DATABASE_URL for connection');
  } catch (error) {
    console.warn('Warning: Could not parse DATABASE_URL, using individual DB environment variables');
  }
}

// Add SSL configuration for Render production
const sslConfig = process.env.NODE_ENV === 'production' ? {
  rejectUnauthorized: false
} : false;

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  ssl: sslConfig,
  connectionTimeoutMillis: 5000, // 5 second timeout
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  max: 10, // Maximum 10 connections
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection test successful');
    client.release();
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
  }
};

// Run test connection in development only
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

module.exports = pool;