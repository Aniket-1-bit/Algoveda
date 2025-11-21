# 🧪 ALGOVEDA - Quick Test Guide

## 🚀 Getting Started (Under 2 Minutes!)

### Step 1: Install PostgreSQL
**If not installed yet:**
- Run: `START_HERE.bat` 
- It will detect PostgreSQL is missing and open the installation guide
- Follow `INSTALL_POSTGRESQL.md` (5 minutes)

### Step 2: Launch ALGOVEDA
**Once PostgreSQL is installed:**
```bash
# Double-click this file in Windows Explorer:
START_HERE.bat
```

This will:
✅ Check PostgreSQL installation
✅ Configure database credentials
✅ Install all dependencies
✅ Create database and tables
✅ Add sample data (1 mentor + 5 students + 3 courses)
✅ Start backend and frontend servers
✅ Open browser to http://localhost:3000/

---

## 👤 Test Credentials

### Mentor Account (Full Access)
```
Email:    john@algoveda.com
Password: mentor123
```

### Student Accounts
```
Email:    student1@algoveda.com  |  student2@algoveda.com  |  student3@algoveda.com
Password: student123             |  student123             |  student123
```

---

## 🎯 10-Minute Feature Test

### Test 1: Student Registration & Login (2 min)
1. Go to http://localhost:3000/
2. Click "Register"
3. Create account: `test@test.com` / `test123` / `Test User`
4. Login with new credentials
5. ✅ See personalized dashboard

### Test 2: Course Enrollment (3 min)
1. Login as `student1@algoveda.com`
2. Click "Browse Courses"
3. Enroll in "Python Programming Fundamentals"
4. Click course card to view details
5. Start first lesson
6. Click "Mark Complete"
7. ✅ See XP +10 notification

### Test 3: Quiz & Code Submission (3 min)
1. In same course, go to Lesson 2
2. Complete the quiz
3. Check score
4. Go to lesson with code challenge
5. Write simple code: `print("Hello")`
6. Submit code
7. ✅ See validation result

### Test 4: Gamification (2 min)
1. Click "Leaderboard" in navbar
2. ✅ See your rank with XP
3. Click profile/dashboard
4. ✅ See level, badges, streak counter
5. Complete more lessons to level up

---

## 🎓 Mentor Features Test (5 min)

### Test 5: Mentor Portal
1. **Logout** student account
2. Login as mentor: `john@algoveda.com` / `mentor123`
3. Click "Mentor Portal" in navbar
4. ✅ See dashboard with:
   - Total students
   - Total courses
   - Engagement metrics

### Test 6: Create Course
1. In Mentor Portal, click "Create New Course"
2. Fill in:
   - Title: "React Fundamentals"
   - Description: "Learn React from scratch"
   - Difficulty: Intermediate
   - Duration: 20 hours
3. Save course
4. ✅ Course appears in catalog

### Test 7: Award Badge
1. Go to "Manage Students" section
2. Select a student
3. Click "Award Badge"
4. Choose "First Steps" badge
5. ✅ Student receives notification

---

## 🏆 Advanced Features Test (10 min)

### Test 8: Daily Challenge
1. Login as student
2. Click "Daily Challenge" in navbar
3. Read challenge description
4. Write solution in code editor
5. Click "Submit Solution"
6. ✅ See test results
7. ✅ Earn XP reward (50 XP)

### Test 9: Social Features
1. Open any lesson
2. Scroll to comments section
3. Post a comment: "Great lesson!"
4. ✅ Comment appears
5. Click "Like" on another comment
6. Reply to a comment
7. ✅ See threaded replies

### Test 10: Certificates
1. Complete ALL lessons in a course (mark each complete)
2. Go to dashboard
3. Click "View Certificate" on completed course
4. ✅ See certificate with:
   - Your name
   - Course title
   - Completion date
   - Unique certificate ID
5. Click "Download Certificate"

---

## 🔍 Feature Checklist

Copy this to track your testing progress:

### Core Features
- [ ] User registration
- [ ] User login/logout
- [ ] Browse courses
- [ ] Enroll in course
- [ ] View lesson content
- [ ] Mark lesson complete
- [ ] Complete quiz
- [ ] Submit code
- [ ] Track progress percentage

### Gamification
- [ ] Earn XP from activities
- [ ] Level up system
- [ ] View leaderboard rankings
- [ ] Earn badges
- [ ] Daily streak tracking
- [ ] Complete daily challenge

### Social & Engagement
- [ ] Post lesson comments
- [ ] Reply to comments
- [ ] Like/unlike comments
- [ ] Delete own comments
- [ ] Receive notifications
- [ ] Mark notifications read

### Mentor Features
- [ ] Access mentor portal
- [ ] View analytics dashboard
- [ ] Create new course
- [ ] Add lessons to course
- [ ] Award badges to students
- [ ] Award XP to students
- [ ] View student performance

### Advanced Features
- [ ] Search courses
- [ ] Filter by difficulty
- [ ] View popular courses
- [ ] Generate certificate
- [ ] Verify certificate
- [ ] Download certificate
- [ ] Daily challenge submission

---

## 🐛 Common Issues & Quick Fixes

### Backend Not Connecting
**Symptom:** "Network Error" in browser
**Fix:**
```bash
cd d:\Algoveda\algoveda-backend
npm start
```

### Frontend Not Loading
**Symptom:** Blank page or "Cannot GET /"
**Fix:**
```bash
cd d:\Algoveda\algoveda-frontend
npm run dev
```

### Database Errors
**Symptom:** "relation does not exist"
**Fix:**
```bash
cd d:\Algoveda\algoveda-backend
npm run init-db
npm run seed
```

### No Sample Data
**Symptom:** Empty courses list
**Fix:**
```bash
cd d:\Algoveda\algoveda-backend
npm run seed
```

---

## 📊 What Sample Data Includes

After running `npm run seed`, you'll have:

### Users (6 total)
- 1 mentor: john@algoveda.com
- 5 students: student1-5@algoveda.com

### Courses (3 complete)
1. **Python Programming Fundamentals**
   - 4 lessons (Variables, Control Flow, Functions, OOP)
   - Beginner level, 15 hours
   
2. **JavaScript Essentials**
   - 4 lessons (Basics, DOM, Async, ES6)
   - Intermediate level, 20 hours
   
3. **Data Structures and Algorithms**
   - 4 lessons (Arrays, LinkedLists, Trees, Graphs)
   - Advanced level, 30 hours

### Badges (4 achievements)
- 🏅 First Steps - Complete first lesson
- 🚀 Quick Learner - Complete 5 lessons in one day
- 💻 Code Master - Submit 10 code solutions
- 🎓 Course Completer - Finish entire course

### Gamification
- Random XP (0-500) assigned to students
- Random levels (1-5)
- Daily streak counters

---

## 🎯 Suggested Test Scenarios

### Scenario A: New Student Journey (10 min)
1. Register new account
2. Browse and enroll in 2 courses
3. Complete 3 lessons
4. Take 2 quizzes
5. Submit 1 code solution
6. Check leaderboard rank
7. View earned badges

### Scenario B: Mentor Workflow (8 min)
1. Login as mentor
2. View student analytics
3. Create new course "Advanced Python"
4. Add 2 lessons
5. Award badge to top student
6. Award bonus XP (100 points)
7. Check engagement metrics

### Scenario C: Power User (15 min)
1. Login as student
2. Enroll in all 3 courses
3. Complete 1 full course (all lessons + quizzes)
4. Generate certificate
5. Complete daily challenge
6. Reach Level 3 (earn 200+ XP)
7. Earn 2 badges
8. Post 5 comments on different lessons
9. Like 10 comments
10. Maintain 3-day streak

---

## ✅ Success Criteria

Your ALGOVEDA instance is working correctly if:

✅ All 3 courses visible in catalog
✅ Student can enroll and see course in dashboard
✅ Lessons load with full content
✅ XP increases after completing lessons
✅ Leaderboard shows all students ranked by XP
✅ Badges appear in student profile when earned
✅ Comments can be posted and liked
✅ Mentor portal shows analytics
✅ Daily challenge loads with code editor
✅ Notifications appear in notification bell

---

## 🚀 Ready to Test!

1. Run `START_HERE.bat`
2. Wait for browser to open
3. Login with test credentials
4. Follow the 10-minute feature test above

**Estimated Total Test Time:** 30-45 minutes to test all features

Happy testing! 🎉
