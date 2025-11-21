const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (be careful with this!)
    // Uncomment only if you want to clear all data
    /*
    await pool.query('DELETE FROM user_badges CASCADE');
    await pool.query('DELETE FROM user_gamification CASCADE');
    await pool.query('DELETE FROM user_progress CASCADE');
    await pool.query('DELETE FROM code_submissions CASCADE');
    await pool.query('DELETE FROM quiz_responses CASCADE');
    await pool.query('DELETE FROM quizzes CASCADE');
    await pool.query('DELETE FROM lessons CASCADE');
    await pool.query('DELETE FROM course_enrollments CASCADE');
    await pool.query('DELETE FROM courses CASCADE');
    await pool.query('DELETE FROM users CASCADE');
    */

    // Create sample users
    const mentorPassword = await bcrypt.hash('mentor123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    const mentorResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, user_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      ['john_mentor', 'john@algoveda.com', mentorPassword, 'John Doe', 'mentor']
    );

    const mentorId = mentorResult.rows[0]?.id || (await pool.query('SELECT id FROM users WHERE username = $1', ['john_mentor'])).rows[0].id;

    // Create sample students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, full_name, user_type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING
         RETURNING *`,
        [`student${i}`, `student${i}@algoveda.com`, studentPassword, `Student ${i}`, 'student']
      );
      if (result.rows[0]) {
        students.push(result.rows[0]);
      }
    }

    console.log(`✅ Created mentor and ${students.length} students`);

    // Create sample courses
    const courseData = [
      {
        title: 'Python Fundamentals',
        description: 'Learn Python from basics to advanced concepts',
        difficulty: 'beginner',
        hours: 20,
      },
      {
        title: 'JavaScript Mastery',
        description: 'Complete guide to modern JavaScript',
        difficulty: 'intermediate',
        hours: 30,
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Master DSA for coding interviews',
        difficulty: 'advanced',
        hours: 40,
      },
    ];

    const courses = [];
    for (const course of courseData) {
      const result = await pool.query(
        `INSERT INTO courses (title, description, instructor_id, difficulty_level, duration_hours)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [course.title, course.description, mentorId, course.difficulty, course.hours]
      );
      courses.push(result.rows[0]);
    }

    console.log(`✅ Created ${courses.length} sample courses`);

    // Create sample lessons for first course
    const lessons = [];
    const lessonData = [
      { title: 'Introduction to Python', description: 'Get started with Python' },
      { title: 'Variables and Data Types', description: 'Learn about Python data types' },
      { title: 'Control Flow', description: 'Conditionals and loops' },
      { title: 'Functions', description: 'Writing reusable functions' },
    ];

    for (let i = 0; i < lessonData.length; i++) {
      const result = await pool.query(
        `INSERT INTO lessons (course_id, title, description, content, order_index, estimated_duration_minutes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          courses[0].id,
          lessonData[i].title,
          lessonData[i].description,
          `## ${lessonData[i].title}\n\nLesson content for ${lessonData[i].title}...`,
          i + 1,
          30 + i * 10,
        ]
      );
      lessons.push(result.rows[0]);
    }

    console.log(`✅ Created ${lessons.length} sample lessons`);

    // Create sample badges
    const badgeData = [
      { name: 'First Steps', description: 'Complete your first lesson' },
      { name: 'Code Master', description: 'Submit 10 code solutions' },
      { name: 'Quiz Expert', description: 'Score 100% on 5 quizzes' },
      { name: 'Consistency King', description: 'Maintain 7-day streak' },
    ];

    const badges = [];
    for (const badge of badgeData) {
      const result = await pool.query(
        `INSERT INTO badges (name, description)
         VALUES ($1, $2)
         RETURNING *`,
        [badge.name, badge.description]
      );
      badges.push(result.rows[0]);
    }

    console.log(`✅ Created ${badges.length} sample badges`);

    // Initialize gamification for students
    for (const student of students) {
      await pool.query(
        `INSERT INTO user_gamification (user_id, total_xp, current_level, daily_streak)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO NOTHING`,
        [student.id, Math.floor(Math.random() * 5000), Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 7)]
      );
    }

    console.log(`✅ Initialized gamification for students`);

    // Enroll students in courses
    for (const student of students) {
      for (const course of courses) {
        await pool.query(
          `INSERT INTO course_enrollments (user_id, course_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [student.id, course.id]
        );
      }
    }

    console.log(`✅ Enrolled students in courses`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Sample Credentials:');
    console.log('   Mentor: john_mentor / mentor123');
    console.log('   Student: student1 / student123 (and student2-5)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
