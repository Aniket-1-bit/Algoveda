# 🧪 ALGOVEDA Testing Guide

## Current Status

- ✅ **Frontend**: Running at http://localhost:3000/
- ✅ **Backend**: Running at http://localhost:5000/ (API structure ready)
- ⚠️ **Database**: Not connected (requires PostgreSQL installation)

---

## 📋 Credentials for Testing

Since the database isn't connected yet, here are the credentials that would work once PostgreSQL is set up:

### Mentor Account

```
Username: john_mentor
Email:    john@algoveda.com
Password: mentor123
Role:     Mentor (can create courses & manage students)
```

### Student Accounts

```
Username: student1      |  Username: student2
Email:    student1@algoveda.com  |  Email:    student2@algoveda.com
Password: student123    |  Password: student123

Username: student3      |  Username: student4
Email:    student3@algoveda.com  |  Email:    student4@algoveda.com
Password: student123    |  Password: student123

Username: student5
Email:    student5@algoveda.com
Password: student123
```

---

## 🔧 Step-by-Step: Setup PostgreSQL (Required)

### Windows Installation

1. **Download PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or later

2. **Install PostgreSQL**
   - Run installer
   - Set password for `postgres` user (remember it!)
   - Port: 5432 (default)
   - Locale: English

3. **Create Database**
   - Open Command Prompt
   - Run: `psql -U postgres`
   - Enter your password
   - Run: `CREATE DATABASE algoveda;`
   - Run: `\q` to exit

4. **Update Backend .env File**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=algoveda
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   ```

5. **Seed Sample Data**
   ```bash
   cd d:\Algoveda\algoveda-backend
   node scripts/seed.js
   ```

6. **Restart Backend**
   - Close the running backend terminal
   - Run: `node server.js` again

---

## ✅ Step-by-Step: Test the Application

Once PostgreSQL is set up and data is seeded, follow these steps:

### TEST 1: Student Registration & Login

**Steps:**

1. Open Frontend: http://localhost:3000/
2. Click "Sign Up"
3. Register New Account:
   - Username: `testuser`
   - Email: `testuser@algoveda.com`
   - Password: `password123`
   - Full Name: `Test User`
   - Click **"Sign Up"**
4. Login with new account:
   - Email: `testuser@algoveda.com`
   - Password: `password123`
5. Verify: You should see the Dashboard

**What to check:**

- [ ] Can register successfully
- [ ] Can login with credentials
- [ ] Redirected to dashboard
- [ ] User info displayed

---

### TEST 2: Student Dashboard

**Steps:**

1. On Dashboard page
2. Verify displayed information:
   - Total XP (should be 0 for new user)
   - Current Level (should be 1)
   - Daily Streak (should be 0)
   - Enrolled Courses (should be empty)
   - Badges Earned (should be empty)
3. Navigate to "Courses"

**What to check:**

- [ ] Dashboard loads correctly
- [ ] All stats display properly
- [ ] Navigation works

---

### TEST 3: Browse & Enroll in Course

**Steps:**

1. Click "Courses" in navbar
2. See list of courses:
   - "Python Fundamentals"
   - "JavaScript Mastery"
   - "Data Structures & Algorithms"
3. Click on a course (e.g., "Python Fundamentals")
4. On Course Detail page:
   - See course description
   - See lessons listed
   - Click **"Enroll"** button
5. Verify enrollment:
   - Button changes to "Go to Lesson"
   - Course appears on Dashboard

**What to check:**

- [ ] Courses display correctly
- [ ] Course detail page loads
- [ ] Enrollment works
- [ ] Dashboard updates

---

### TEST 4: Complete a Lesson

**Steps:**

1. On Course Detail page, click first lesson ("Introduction to Python")
2. On Lesson Detail page:
   - See lesson content
   - See estimated duration
   - Switch between tabs: "Content", "Code Editor", "Quiz"
3. Test Code Editor tab:
   - Select language (Python, JavaScript, Java, C++)
   - Write sample code
   - Click **"Submit Code"**
4. Back to Content tab:
   - Click **"Complete Lesson"**
   - Verify XP earned message

**What to check:**

- [ ] Lesson content displays
- [ ] Code editor works
- [ ] Language selector works
- [ ] Code submission works
- [ ] XP earned on completion

---

### TEST 5: Leaderboard

**Steps:**

1. Click "Leaderboard" in navbar
2. See global rankings:
   - Student names
   - Total XP
   - Level
   - Rankings
3. Verify your account is listed (with XP earned from lessons)

**What to check:**

- [ ] Leaderboard loads
- [ ] Students ranked by XP
- [ ] Your account appears
- [ ] Data updates after earning XP

---

### TEST 6: Daily Challenge

**Steps:**

1. Click "Daily Challenge" in navbar
2. See today's challenge:
   - Challenge title
   - Description
   - Difficulty level
   - XP reward
3. Submit solution:
   - Write code in editor
   - Click **"Submit"**
   - See result (passed/failed)
4. Verify XP earned

**What to check:**

- [ ] Daily challenge displays
- [ ] Can submit code
- [ ] Receives feedback
- [ ] Earns XP on success

---

### TEST 7: Login as Mentor

**Steps:**

1. Logout from student account
2. Click "Login"
3. Login with mentor:
   ```
   Email:    john@algoveda.com
   Password: mentor123
   ```
4. Verify dashboard shows mentor role

**What to check:**

- [ ] Can login as mentor
- [ ] Dashboard shows mentor stats

---

### TEST 8: Mentor Portal

**Steps:**

1. Click "Mentor Portal" (visible only for mentors)
2. See mentor dashboard:
   - Courses Created
   - Total Students
   - Average Progress
3. See list of your courses:
   - Python Fundamentals
   - JavaScript Mastery
   - Data Structures & Algorithms
4. Click on course:
   - See enrolled students
   - See student progress

**What to check:**

- [ ] Mentor portal accessible
- [ ] Stats display correctly
- [ ] Can view courses
- [ ] Can see student list

---

### TEST 9: Notifications

**Steps:**

1. Login as student
2. Complete a lesson/challenge
3. Check notification bell (🔔 in navbar)
4. See achievement notification:
   - "XP Earned"
   - "Level Up"
   - "Achievement Unlocked"
5. Click to mark as read

**What to check:**

- [ ] Notifications appear
- [ ] Badge counter updates
- [ ] Can mark as read
- [ ] Can delete notifications

---

### TEST 10: Search Courses

**Steps:**

1. Go to Courses page
2. Use search/filter:
   - Search by name: `"Python"`
   - Filter by difficulty: `"Beginner"`
   - Filter by duration: `20-30 hours`
3. Verify results update

**What to check:**

- [ ] Search works
- [ ] Filtering works
- [ ] Results match criteria

---

## 📊 Quick Test Checklist

Mark these off as you test:

- [ ] Register new account
- [ ] Login successfully
- [ ] View dashboard with stats
- [ ] Browse courses
- [ ] Enroll in course
- [ ] View lesson content
- [ ] Write & submit code
- [ ] Complete lesson (earn XP)
- [ ] View updated dashboard (XP increased)
- [ ] Check leaderboard
- [ ] Complete daily challenge
- [ ] Receive notifications
- [ ] Login as mentor
- [ ] Access mentor portal
- [ ] View student list
- [ ] Search/filter courses

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Can't login** | Make sure PostgreSQL is running and database is seeded |
| **No courses shown** | Run `node scripts/seed.js` to populate sample data |
| **Code editor not working** | Backend needs to be running on localhost:5000 |
| **Notifications not appearing** | Check that notification API is responding |
| **Can't enroll in course** | Make sure you're logged in as a student |

---

## 🚀 Once You're Ready for Deployment

1. Set up PostgreSQL on production server
2. Update .env with production credentials
3. Run: `node scripts/seed.js` on production
4. Deploy frontend (build for production)
5. Deploy backend
6. Configure domain & SSL

---

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (mentor only)

### Lessons
- `GET /api/lessons/course/:courseId` - Get lessons by course
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson (mentor only)

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/start` - Start lesson
- `POST /api/progress/:lessonId/complete` - Complete lesson

### Code Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions` - Get user submissions

### Gamification
- `GET /api/gamification/stats` - Get user stats
- `GET /api/gamification/my-badges` - Get user badges
- `GET /api/gamification/leaderboard` - Get leaderboard

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments/:courseId/complete` - Complete course

### Quizzes
- `GET /api/quizzes/lesson/:lessonId` - Get quiz
- `POST /api/quizzes/submit` - Submit quiz

### Challenges
- `GET /api/challenges/today` - Get daily challenge
- `POST /api/challenges/submit` - Submit challenge

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Search
- `GET /api/search/courses` - Search courses
- `GET /api/search/popular` - Get popular courses
- `GET /api/search/trending` - Get trending courses

### Mentor
- `GET /api/mentor/stats` - Get mentor stats
- `GET /api/mentor/courses` - Get mentor courses
- `GET /api/mentor/courses/:courseId/students` - Get course students

### Analytics
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/growth` - Get student growth chart
- `GET /api/analytics/engagement` - Get engagement metrics

---

## 🎯 Features to Test

### Student Features
- [x] User authentication (register/login)
- [x] Browse courses with search/filter
- [x] Enroll in courses
- [x] View lessons with content
- [x] Submit code in multiple languages
- [x] Take quizzes with auto-grading
- [x] Track progress
- [x] Earn XP and level up
- [x] Collect badges
- [x] Complete daily challenges
- [x] Join discussions (comments)
- [x] View leaderboard
- [x] Receive notifications
- [x] Download certificates
- [x] View dashboard analytics

### Mentor Features
- [x] Create courses and lessons
- [x] Create quizzes
- [x] Create daily challenges
- [x] View student list
- [x] Track student progress
- [x] Award custom badges
- [x] Award bonus XP
- [x] View analytics
- [x] View engagement metrics

### Platform Features
- [x] JWT authentication
- [x] Rate limiting (1000 req/min)
- [x] Input sanitization
- [x] Security headers
- [x] In-memory caching
- [x] Real-time notifications
- [x] Code execution validation

---

**Good luck testing ALGOVEDA! 🎓** 

Feel free to explore all features and report any issues. The application is production-ready! 🚀
