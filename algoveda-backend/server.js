const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');
const { initializeDatabase } = require('./config/schema');
const errorHandler = require('./middleware/errorHandler');
const createRateLimiter = require('./middleware/rateLimiter');
const { securityHeaders, sanitizeInput, validatePayloadSize } = require('./middleware/security');

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const codeSubmissionRoutes = require('./routes/codeSubmissionRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const commentRoutes = require('./routes/commentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(createRateLimiter(1000, 60)); // 1000 requests per minute

// Test database connection and initialize
const initializeApp = async () => {
  try {
    console.log('🔍 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection established');
    
    console.log('🔧 Initializing database schema...');
    await initializeDatabase();
    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    console.error('\n⚠️  Please check:');
    console.error('1. PostgreSQL is installed and running');
    console.error('2. Database credentials in .env file are correct');
    console.error('3. Database "algoveda" exists (run: npm run init-db)\n');
    process.exit(1);
  }
};

initializeApp();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/submissions', codeSubmissionRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 ALGOVEDA Backend Server Running');
  console.log('========================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log('========================================\n');
  console.log('✅ Ready to accept requests!');
  console.log('📖 API Docs: http://localhost:' + PORT + '/api/health');
  console.log('\nPress Ctrl+C to stop the server\n');
});
