# 🎓 ALGOVEDA - Interactive Learning Platform with Gamification

## 🚀 Quick Start (5 Minutes)

### First Time Setup

1. **Double-click `START_HERE.bat`** in this folder
   - The script will check for PostgreSQL
   - If missing, it will guide you through installation
   - After PostgreSQL is installed, run `START_HERE.bat` again

2. **Wait for automatic setup:**
   - ✅ Installs dependencies
   - ✅ Creates database
   - ✅ Initializes tables
   - ✅ Seeds sample data
   - ✅ Starts servers
   - ✅ Opens browser

3. **Login and test:**
   - Mentor: `john@algoveda.com` / `mentor123`
   - Student: `student1@algoveda.com` / `student123`

**That's it!** 🎉

---

## 📚 Documentation

- **INSTALL_POSTGRESQL.md** - PostgreSQL installation guide for Windows
- **SETUP_INSTRUCTIONS.md** - Complete manual setup instructions
- **QUICK_TEST_GUIDE.md** - 30-minute feature testing guide
- **TESTING_GUIDE.md** - Comprehensive testing scenarios

---

## ✨ Features

### For Students
- 📖 Interactive course catalog with enrollment
- 🎯 Progress tracking and lesson completion
- 💻 Hands-on code editor with validation
- 🎮 Gamification (XP, levels, badges, streaks)
- 🏆 Leaderboard rankings
- 📝 Quizzes and assessments
- 💬 Discussion forums with comments
- 🎖️ Course completion certificates
- ⚡ Daily coding challenges
- 🔔 Real-time notifications

### For Mentors
- 👨‍🏫 Course creation and management
- 📊 Student analytics dashboard
- 🏅 Badge and XP award system
- 👥 Student performance tracking
- 💡 Daily challenge creation
- 📈 Engagement metrics

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL (17 tables)
- JWT Authentication
- bcrypt Password Hashing
- In-memory Caching
- Rate Limiting

### Frontend
- React 18
- React Router
- Vite Build Tool
- CSS3 (Grid/Flexbox)
- Axios API Client

---

## 📦 Project Structure

```
Algoveda/
├── algoveda-backend/          # Node.js + Express backend
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic (15 controllers)
│   ├── middleware/            # Auth, security, rate limiting
│   ├── routes/                # API routes (15 route files)
│   ├── scripts/               # Database init & seeding
│   ├── services/              # Caching, code execution
│   └── server.js              # Express app entry point
│
├── algoveda-frontend/         # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # Page components (10 pages)
│   │   ├── services/          # API service layer
│   │   ├── styles/            # CSS modules
│   │   └── App.jsx            # Main app component
│   └── index.html
│
├── START_HERE.bat             # 🚀 One-click setup & launch
├── INSTALL_POSTGRESQL.md      # PostgreSQL install guide
├── SETUP_INSTRUCTIONS.md      # Manual setup guide
├── QUICK_TEST_GUIDE.md        # Feature testing guide
└── README.md                  # This file
```

---

## 🗄️ Database Schema

17 PostgreSQL tables with proper relationships:

**Core:**
- users, courses, lessons, course_enrollments

**Learning:**
- user_progress, quizzes, quiz_responses, code_submissions

**Gamification:**
- user_gamification, badges, user_badges, daily_challenges, user_daily_progress

**Social:**
- lesson_comments, comment_likes, notifications, certificates

---

## 🎯 Sample Data

**After setup, you'll have:**
- 1 mentor account
- 5 student accounts
- 3 complete courses:
  - Python Programming Fundamentals (Beginner, 15h)
  - JavaScript Essentials (Intermediate, 20h)
  - Data Structures & Algorithms (Advanced, 30h)
- 12 lessons (4 per course)
- 4 achievement badges
- Random XP and levels for testing

---

## 🧪 Testing

### Quick Test (10 minutes)
```bash
# Ensure servers are running
START_HERE.bat

# Then follow QUICK_TEST_GUIDE.md for:
- Student registration & login
- Course enrollment
- Lesson completion
- Quiz submission
- Gamification features
- Mentor portal
```

### Comprehensive Test (30 minutes)
See **TESTING_GUIDE.md** for:
- 10 detailed test scenarios
- Feature checklist
- API endpoint testing
- Edge case validation

---

## 🔧 Manual Setup (Alternative)

If `START_HERE.bat` doesn't work:

```bash
# 1. Install PostgreSQL (see INSTALL_POSTGRESQL.md)

# 2. Update .env with your PostgreSQL password
cd algoveda-backend
notepad .env  # Set DB_PASSWORD

# 3. Install dependencies
cd algoveda-backend
npm install

cd ../algoveda-frontend
npm install

# 4. Setup database
cd ../algoveda-backend
npm run setup

# 5. Start servers (2 terminals)
# Terminal 1:
npm start

# Terminal 2:
cd ../algoveda-frontend
npm run dev

# 6. Open browser
http://localhost:3000/
```

---

## 🌐 URLs

- **Frontend:** http://localhost:3000/
- **Backend API:** http://localhost:5000/
- **Health Check:** http://localhost:5000/api/health

---

## 👤 Default Credentials

### Mentor Account
```
Email:    john@algoveda.com
Password: mentor123
```

### Student Account
```
Email:    student1@algoveda.com
Password: student123
```

*(More student accounts: student2-5@algoveda.com / student123)*

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (1000 req/min)
- ✅ Input sanitization
- ✅ Security headers (XSS, Clickjacking, CSP)
- ✅ CORS protection
- ✅ Payload size limits (10MB)

---

## ⚡ Performance

- ✅ In-memory caching (courses, leaderboards, analytics)
- ✅ Database indexing on foreign keys
- ✅ Connection pooling
- ✅ Query optimization
- ✅ Lazy loading components

---

## 🚀 Production Deployment

**When ready for production:**

1. **Update .env:**
   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   DB_PASSWORD=<strong-password>
   ```

2. **Build frontend:**
   ```bash
   cd algoveda-frontend
   npm run build
   ```

3. **Deploy to:**
   - Backend: Heroku, AWS, DigitalOcean
   - Database: AWS RDS, Heroku Postgres
   - Frontend: Vercel, Netlify, AWS S3

4. **Enable:**
   - HTTPS (SSL/TLS)
   - Database backups
   - Monitoring (New Relic, DataDog)
   - Logging (Winston, Morgan)

---

## 📊 API Endpoints

60+ RESTful endpoints across 15 route files:

- **/api/auth** - Register, login, logout
- **/api/courses** - Course CRUD
- **/api/lessons** - Lesson management
- **/api/progress** - Progress tracking
- **/api/submissions** - Code submissions
- **/api/gamification** - XP, badges, leaderboard
- **/api/enrollments** - Course enrollment
- **/api/quizzes** - Quiz management
- **/api/challenges** - Daily challenges
- **/api/mentor** - Mentor portal
- **/api/comments** - Discussion forums
- **/api/certificates** - Certificate generation
- **/api/search** - Course search & discovery
- **/api/notifications** - User notifications
- **/api/analytics** - Mentor analytics

---

## 👐 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Fix:** Check if PostgreSQL is running:
```bash
sc query postgresql-x64-14
```

### Port Already in Use
```
EADDRINUSE: address already in use :::5000
```
**Fix:** Kill process on port 5000:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Tables Not Found
```
relation "users" does not exist
```
**Fix:** Initialize database:
```bash
cd algoveda-backend
npm run init-db
```

See **SETUP_INSTRUCTIONS.md** for more troubleshooting.

---

## 📝 NPM Scripts

### Backend
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-restart)
npm run init-db  # Initialize database schema
npm run seed     # Add sample data
npm run setup    # init-db + seed (one command)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication
- PostgreSQL database design
- React component architecture
- Gamification mechanics
- Real-time features
- Security best practices

---

## 📄 License

MIT License - Free to use for learning and commercial projects

---

## 🤝 Contributing

This is an educational platform. Feel free to:
- Add new features
- Improve UI/UX
- Add more test cases
- Optimize performance
- Fix bugs

---

## 📞 Support

For issues or questions:
1. Check **SETUP_INSTRUCTIONS.md**
2. Review **TESTING_GUIDE.md**
3. Check console logs for errors
4. Verify PostgreSQL is running

---

## ✅ Quick Checklist

Before testing:
- [ ] PostgreSQL installed
- [ ] `.env` configured with DB password
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run setup`)
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Browser open to http://localhost:3000/

---

## 🎉 What's Next?

After testing ALGOVEDA, you can:
1. Customize UI/UX with your branding
2. Add more courses and content
3. Integrate payment gateway
4. Add video lessons
5. Implement live coding sessions
6. Add mobile app (React Native)
7. Deploy to production

---

**Built with ❤️ for learning and innovation**

---

## Quick Links

- 🚀 [START_HERE.bat](START_HERE.bat) - One-click setup
- 📖 [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Detailed setup
- 🧪 [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) - Quick testing
- 📝 [TESTING_GUIDE.md](TESTING_GUIDE.md) - Full test suite
- 💾 [INSTALL_POSTGRESQL.md](INSTALL_POSTGRESQL.md) - PostgreSQL setup

---

Ready to start? **Double-click `START_HERE.bat`** 🚀
