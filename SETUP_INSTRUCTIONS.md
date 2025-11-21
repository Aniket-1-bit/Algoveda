# 🚀 ALGOVEDA - Complete Setup Instructions

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ PostgreSQL (v12 or higher) - [Download here](https://www.postgresql.org/download/windows/)
- ✅ Git (optional, for version control)

---

## Step 1: Install PostgreSQL on Windows

### Option A: Download Installer
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. **Important**: Remember the password you set for the `postgres` user!
4. Default port: 5432 (keep this unless you have conflicts)
5. During installation, select "Stack Builder" if prompted (optional)

### Option B: Using Chocolatey (if installed)
```bash
choco install postgresql
```

### Verify Installation
Open Command Prompt and run:
```bash
psql --version
```

If you see a version number, PostgreSQL is installed correctly!

**If `psql` command not found:**
- Add PostgreSQL to PATH: `C:\Program Files\PostgreSQL\14\bin`
- Restart Command Prompt

---

## Step 2: Configure Database Credentials

1. Navigate to backend folder:
   ```bash
   cd d:\Algoveda\algoveda-backend
   ```

2. Open `.env` file and update with your PostgreSQL password:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
   DB_NAME=algoveda
   DB_PORT=5432
   
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   
   PORT=5000
   NODE_ENV=development
   ```

---

## Step 3: Install Dependencies

### Backend Setup
```bash
cd d:\Algoveda\algoveda-backend
npm install
```

### Frontend Setup
```bash
cd d:\Algoveda\algoveda-frontend
npm install
```

---

## Step 4: Initialize Database

### Automatic Setup (Recommended)
From the backend folder:
```bash
npm run setup
```

This will:
1. Create the `algoveda` database
2. Initialize all 17 tables with proper schema
3. Seed with sample data (1 mentor + 5 students + 3 courses)

### Manual Setup (Alternative)
If automatic setup fails, run these commands separately:

**Step 1: Initialize Database Schema**
```bash
npm run init-db
```

**Step 2: Seed Sample Data**
```bash
npm run seed
```

---

## Step 5: Start the Application

### Start Backend (Terminal 1)
```bash
cd d:\Algoveda\algoveda-backend
npm start
```

Expected output:
```
✅ Database connection established
✅ Database schema initialized successfully
🚀 Server running on port 5000
```

### Start Frontend (Terminal 2)
```bash
cd d:\Algoveda\algoveda-frontend
npm run dev
```

Expected output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## Step 6: Access the Application

Open your browser and go to: **http://localhost:3000/**

---

## 🧪 Test Credentials

### Mentor Account (Full Access)
```
Email:    john@algoveda.com
Password: mentor123
```

**Mentor can:**
- Create and manage courses
- View student analytics
- Award badges and XP
- Access mentor portal
- Create daily challenges

### Student Accounts
```
Email:    student1@algoveda.com
Password: student123

Email:    student2@algoveda.com
Password: student123

Email:    student3@algoveda.com
Password: student123
```

**Students can:**
- Enroll in courses
- Complete lessons and quizzes
- Submit code challenges
- Earn XP and badges
- View leaderboard
- Complete daily challenges

---

## 📋 Sample Data Included

After running `npm run seed`, you'll have:

- **Users**: 1 mentor + 5 students
- **Courses**: 3 complete courses
  - Python Programming Fundamentals
  - JavaScript Essentials
  - Data Structures and Algorithms
- **Lessons**: 4 lessons per course (12 total)
- **Badges**: 4 achievement badges
- **Gamification**: Random XP and levels for students

---

## 🧪 Testing Checklist

### 1️⃣ **Authentication**
- [ ] Register new student account
- [ ] Login with mentor credentials
- [ ] Login with student credentials
- [ ] Logout and verify session ends

### 2️⃣ **Course Enrollment**
- [ ] Browse available courses
- [ ] Enroll in a course
- [ ] View enrolled courses in dashboard
- [ ] Unenroll from a course

### 3️⃣ **Learning Path**
- [ ] Start a lesson
- [ ] Read lesson content
- [ ] Mark lesson as complete
- [ ] Complete a quiz
- [ ] Submit code for verification
- [ ] Track progress percentage

### 4️⃣ **Gamification**
- [ ] View XP and current level
- [ ] Check leaderboard rankings
- [ ] Earn badges
- [ ] Maintain daily streak
- [ ] Complete daily challenge

### 5️⃣ **Social Features**
- [ ] Post comment on lesson
- [ ] Reply to a comment
- [ ] Like/unlike comments
- [ ] Delete own comments
- [ ] View comment threads

### 6️⃣ **Mentor Features** (Login as mentor)
- [ ] Create new course
- [ ] Add lessons to course
- [ ] View student analytics
- [ ] Award badges to students
- [ ] Award XP to students
- [ ] Create daily challenges
- [ ] View engagement metrics

### 7️⃣ **Certificates**
- [ ] Complete a course 100%
- [ ] Generate certificate
- [ ] Download certificate
- [ ] Verify certificate with ID

### 8️⃣ **Search & Discovery**
- [ ] Search courses by keyword
- [ ] Filter by difficulty level
- [ ] View popular courses
- [ ] View trending courses
- [ ] Get personalized suggestions

### 9️⃣ **Notifications**
- [ ] Receive badge earned notification
- [ ] Receive course completion notification
- [ ] Mark notifications as read
- [ ] Delete notifications
- [ ] View unread count badge

### 🔟 **Daily Challenges**
- [ ] View today's challenge
- [ ] Submit solution
- [ ] View test results
- [ ] Earn XP for completion
- [ ] View solution after completion

---

## 🔧 Troubleshooting

### Database Connection Failed
**Error:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # Check if PostgreSQL service is running
   sc query postgresql-x64-14
   ```
2. Verify credentials in `.env` file
3. Ensure database `algoveda` exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Kill process using port 5000:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```
2. Or change PORT in `.env` file

### Frontend Can't Connect to Backend
**Error:** Network errors in browser console

**Solutions:**
1. Verify backend is running on port 5000
2. Check CORS settings in `server.js`
3. Ensure frontend API base URL is correct in `api.js`

### Tables Not Created
**Error:** `relation "users" does not exist`

**Solutions:**
1. Run database initialization:
   ```bash
   npm run init-db
   ```
2. Check PostgreSQL user permissions
3. Manually run schema creation from `config/schema.js`

---

## 🎯 Quick Test Scenarios

### Scenario 1: New Student Journey
1. Register as new student
2. Browse courses
3. Enroll in "Python Programming Fundamentals"
4. Complete first lesson
5. Take quiz
6. Submit code exercise
7. Check XP earned
8. View leaderboard position

### Scenario 2: Mentor Workflow
1. Login as mentor (john@algoveda.com)
2. Create new course "Advanced JavaScript"
3. Add 3 lessons
4. View student enrollments
5. Award badge to top student
6. Create daily challenge
7. View analytics dashboard

### Scenario 3: Daily Challenge
1. Login as student
2. Navigate to Daily Challenge
3. Read challenge description
4. Write solution in code editor
5. Submit solution
6. View test results
7. Check XP reward

---

## 📊 Database Schema Overview

The system includes 17 interconnected tables:

**Core Tables:**
- `users` - Student and mentor accounts
- `courses` - Course catalog
- `lessons` - Lesson content
- `course_enrollments` - User enrollments

**Learning Progress:**
- `user_progress` - Lesson completion tracking
- `quizzes` - Quiz/LSS questions
- `quiz_responses` - Student quiz submissions
- `code_submissions` - Code exercise submissions

**Gamification:**
- `user_gamification` - XP, levels, streaks
- `badges` - Achievement badges
- `user_badges` - Badge awards
- `daily_challenges` - Daily coding challenges
- `user_daily_progress` - Challenge completion

**Social & Engagement:**
- `lesson_comments` - Discussion threads
- `comment_likes` - Comment interactions
- `notifications` - In-app notifications
- `certificates` - Course completion certificates

---

## 🚀 Production Deployment Tips

When deploying to production:

1. **Update Environment Variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=<use-strong-random-secret>
   DB_PASSWORD=<strong-database-password>
   ```

2. **Use Production Database:**
   - Consider managed PostgreSQL (AWS RDS, Azure Database)
   - Enable SSL connections
   - Regular backups

3. **Security Hardening:**
   - Enable rate limiting (already implemented)
   - Use HTTPS
   - Set secure CORS origins
   - Enable helmet security headers

4. **Performance:**
   - Cache is already implemented
   - Add Redis for distributed caching
   - Database indexing (already in schema)
   - CDN for static assets

---

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify all prerequisites are installed
3. Check terminal output for error messages
4. Review `.env` configuration

---

## ✅ Setup Complete!

Once you see both servers running without errors, you're ready to test ALGOVEDA!

**Backend Running:** ✅ http://localhost:5000/
**Frontend Running:** ✅ http://localhost:3000/
**Database Connected:** ✅ PostgreSQL

Happy coding! 🎉
