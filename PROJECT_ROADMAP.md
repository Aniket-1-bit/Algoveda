# ALGOVEDA Project Roadmap & Implementation Guide

## 📋 Project Overview
**ALGOVEDA** is an interactive educational platform merging structured learning content with a gamification engine to improve student engagement and technical mastery.

**Duration**: 3 Months (October 2025 - December 2025)
**Target Audience**: Students and Mentors/Teachers
**Key Technologies**: React.js, Node.js/Express, PostgreSQL, Java Spring Boot (for future phases)

---

## 🎯 Project Phases

### **Phase 1: Foundation & Planning ✅ COMPLETED**
**Duration**: Weeks 1-3

#### Completed Deliverables:
1. ✅ **Backend Setup**
   - Express.js server with modular architecture
   - Database configuration (PostgreSQL connection pool)
   - JWT-based authentication system
   - Error handling middleware
   - CORS & request parsing middleware

2. ✅ **Database Schema**
   - Users table (student/mentor roles)
   - Courses & Lessons hierarchy
   - Gamification tables (user_gamification, badges, user_badges)
   - Progress tracking (user_progress)
   - Code submissions & quiz responses
   - LSS (Learning Sprint Sessions) tables

3. ✅ **Frontend Setup**
   - React with Vite build tool
   - Tailwind CSS setup for styling
   - React Router for navigation
   - Axios for API communication
   - Context API for state management

4. ✅ **UI/UX Components**
   - Responsive Navbar with authentication status
   - Home page with feature highlights
   - Authentication pages (Login/Register)
   - Course browse page
   - Student dashboard (placeholder)

5. ✅ **API Contracts**
   - Authentication endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
   - Course endpoints: `GET /api/courses`, `GET /api/courses/:id`, `POST /api/courses`

---

### **Phase 2: Core Feature Development ⏳ IN PROGRESS**
**Duration**: Weeks 4-9

#### Key Features to Implement:

1. **Authentication System Enhancement**
   - Email verification
   - Password reset functionality
   - Profile management endpoints
   - OAuth integration (optional)

2. **First Learning Path - Python Basics**
   - Create structured lessons module
   - Lesson endpoints: CRUD operations
   - Prerequisites validation
   - Learning outcomes tracking

3. **Hands-on Coding Environment MVP**
   - Browser-based code editor
   - Single language compilation (Python)
   - Code submission API
   - Test case execution
   - Real-time feedback system

4. **Student Progress Dashboard Enhancement**
   - Fetch user progress from database
   - Display course enrollment status
   - Time tracking analytics
   - Learning heatmaps

5. **Database Population**
   - Seed sample courses
   - Add Python Basics lesson content
   - Create initial badges
   - Test data setup

#### Tasks:
- [ ] Create lesson management endpoints
- [ ] Build code editor UI component
- [ ] Implement code compilation service
- [ ] Create progress calculation service
- [ ] Build course enrollment system
- [ ] Connect dashboard to backend data
- [ ] Create lesson detail page
- [ ] Implement quiz/LSS component

---

### **Phase 3: Gamification & Launch Prep ⏳ PENDING**
**Duration**: Weeks 10-12

#### Key Features to Implement:

1. **Gamification Engine**
   - XP calculation system (+50 lesson, +30 quiz, +200 project)
   - Level progression (1-10 levels with 10-20% XP growth)
   - Badge awarding triggers
   - Daily streak tracking
   - Real-time XP updates

2. **Leaderboards**
   - Global leaderboard
   - Course-specific leaderboards
   - Weekly/monthly rankings
   - XP-based sorting

3. **Daily Challenges & Streaks**
   - Daily puzzle generation
   - Streak counter persistence
   - Streak reset logic
   - Streak rewards

4. **Mentor Portal MVP**
   - Custom quiz creation
   - Student group management
   - Bonus XP awarding
   - Custom badge creation
   - Analytics dashboard

5. **Testing & Optimization**
   - Unit tests for services
   - Integration tests for APIs
   - Performance optimization
   - Database query optimization
   - Frontend bundle size optimization

6. **Deployment Preparation**
   - Production environment setup
   - Database migration scripts
   - Deployment documentation
   - Security hardening

#### Tasks:
- [ ] Build gamification service
- [ ] Create XP calculation logic
- [ ] Implement level system
- [ ] Build leaderboard component
- [ ] Create daily challenge system
- [ ] Build mentor portal pages
- [ ] Implement analytics engine
- [ ] Write comprehensive tests
- [ ] Setup CI/CD pipeline
- [ ] Deploy to production

---

## 🏗️ Architecture Overview

### **Frontend Structure**
```
algoveda-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Courses.jsx
│   │   ├── Dashboard.jsx
│   │   └── Lesson.jsx (TODO)
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js
│   ├── services/            # API services
│   │   └── api.js
│   ├── styles/              # CSS stylesheets
│   └── App.jsx
├── index.html
├── vite.config.js
└── package.json
```

### **Backend Structure**
```
algoveda-backend/
├── config/
│   ├── database.js          # PostgreSQL connection
│   └── schema.js            # Database initialization
├── controllers/             # Request handlers
│   ├── authController.js
│   └── courseController.js
├── routes/                  # API route definitions
│   ├── authRoutes.js
│   └── courseRoutes.js
├── middleware/              # Express middleware
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js
├── services/                # Business logic (TODO)
├── utils/                   # Utility functions (TODO)
├── .env                     # Environment variables
├── server.js                # Express app setup
└── package.json
```

### **Database Schema Summary**
- **users**: User accounts (student/mentor)
- **courses**: Course metadata
- **lessons**: Course modules
- **user_gamification**: XP, levels, streaks
- **badges**: Achievement definitions
- **user_badges**: User achievements
- **user_progress**: Lesson completion tracking
- **code_submissions**: Code challenge submissions
- **quizzes**: LSS (Learning Sprint Sessions)
- **quiz_responses**: User quiz answers

---

## 🚀 Getting Started

### **Backend Setup**
```bash
cd algoveda-backend
npm install
# Create PostgreSQL database named 'algoveda'
# Update .env with your database credentials
npm run dev
# Server runs on http://localhost:5000
```

### **Frontend Setup**
```bash
cd algoveda-frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### **Database Setup**
```sql
-- Create database
CREATE DATABASE algoveda;

-- Tables are auto-created on first server run via schema.js
```

---

## 📚 Feature Progression Map

### Phase 1 ✅ DONE
- [x] Project structure setup
- [x] Backend API framework
- [x] Database schema design
- [x] Frontend foundation
- [x] Authentication (JWT)
- [x] Basic UI components
- [x] Home, Login, Register pages
- [x] Course listing page
- [x] Dashboard template

### Phase 2 (Starting Now)
- [ ] Lesson content management
- [ ] Coding environment MVP
- [ ] Course enrollment
- [ ] Progress tracking
- [ ] Quiz/LSS system
- [ ] Code execution service
- [ ] Enhanced dashboard
- [ ] User profile management

### Phase 3 (Final)
- [ ] Gamification engine
- [ ] XP system
- [ ] Badge system
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Mentor portal
- [ ] Analytics
- [ ] Testing & QA
- [ ] Deployment

---

## 🔑 Key Features by User Type

### **Student Features**
- Browse and enroll in courses
- Complete lessons and LSS (Learning Sprint Sessions)
- Write and test code in browser
- Track learning progress with analytics
- Earn XP, badges, and climb levels
- Maintain daily streaks
- Compete on leaderboards
- Receive personalized recommendations

### **Mentor Features**
- Create and manage courses
- Design custom quizzes and challenges
- Deploy LSS sessions to groups
- Award bonus XP and custom badges
- View detailed student analytics
- Identify struggling students
- Generate performance reports

---

## 🎮 Gamification Mechanics

### **XP Earning**
- Complete lesson: +50 XP
- Quiz completion: +30 XP
- Perfect quiz score: +50 XP bonus
- Code challenge solved: +100 XP
- Project completion: +200 XP
- Daily streak bonus: +20 XP (scales with streak length)
- Help others: +40 XP

### **Levels (1-10)**
- Level 1 (Novice) → Level 10 (Master)
- Escalating XP requirements (10-20% growth per level)
- Certificates awarded at specific milestones
- Visual level indicators and badges

### **Achievement Badges**
- Hello World (first code submission)
- Logic Builder (5 problems solved)
- Debug Hero (10 bugs fixed)
- Algorithm Ace (10 algorithm challenges)
- Full-Stack Initiate (complete web dev intro)
- Community Contributor (helpful posts)
- Project Pro (5 mini-projects deployed)

---

## 📊 API Endpoint Reference

### **Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (client-side token removal)

### **Courses**
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details with lessons
- `POST /api/courses` - Create course (mentor only)

### **To Be Implemented**
- Lesson endpoints (GET, POST, PUT, DELETE)
- Progress tracking endpoints
- Code submission endpoints
- Quiz endpoints
- Gamification endpoints
- User profile endpoints
- Leaderboard endpoints

---

## ⚙️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js + Vite | Fast, modern UI |
| Styling | CSS + Responsive Design | Beautiful responsive UI |
| State Management | React Context API | Auth & app state |
| API Client | Axios | HTTP requests |
| Backend | Node.js + Express.js | API server |
| Authentication | JWT + bcrypt | Secure auth |
| Database | PostgreSQL | Data persistence |
| Deployment | TBD | Production hosting |

---

## 🛣️ Next Steps (Phase 2)

1. **Create Lesson Module**
   - Build lesson endpoints
   - Add lesson detail page
   - Implement enrollment system

2. **Build Coding Environment**
   - Design code editor UI
   - Create code execution service
   - Build test case runner

3. **Enhance Dashboard**
   - Connect to backend data
   - Show real progress metrics
   - Display user badges

4. **Database Population**
   - Create Python Basics course
   - Add sample lessons
   - Seed initial badges

---

## 📝 Development Notes

- **Code Standards**: Clean, modular, well-documented
- **Error Handling**: Comprehensive error messages
- **Security**: JWT auth, password hashing, SQL injection prevention
- **Performance**: Connection pooling, lazy loading, code splitting
- **Testing**: Unit tests, integration tests (Phase 3)

---

**Last Updated**: November 20, 2025
**Current Phase**: Phase 1 ✅ Complete | Phase 2 🚀 Starting
