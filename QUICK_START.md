# ALGOVEDA - Quick Start (5 Minutes)

## ⚡ Quick Setup

### 1️⃣ Database Setup (1 min)
```bash
psql -U postgres
CREATE DATABASE algoveda;
\q
```

### 2️⃣ Backend Setup (2 min)
```bash
cd d:\Algoveda\algoveda-backend

# Edit .env with your database password
# DB_PASSWORD=your_postgres_password

npm install
npm run dev
```
✅ Backend runs on **http://localhost:5000**

### 3️⃣ Frontend Setup (2 min)
```bash
# New terminal
cd d:\Algoveda\algoveda-frontend
npm install
npm run dev
```
✅ Frontend runs on **http://localhost:3000**

---

## 🌐 Visit the App

Open browser → **http://localhost:3000**

### 🔐 Test User Flow:
1. Click **"Sign Up"** → Create account
2. Click **"Login"** → Login with credentials
3. Click **"Dashboard"** → View your dashboard
4. Click **"Courses"** → Browse available courses

---

## 📁 Project Structure

```
📦 algoveda-backend/
  ├── API server on port 5000
  ├── PostgreSQL database connection
  └── JWT authentication

📦 algoveda-frontend/
  ├── React + Vite on port 3000
  ├── Responsive UI with routing
  └── Context API for state management
```

---

## 🎯 What's Already Built (Phase 1 ✅)

✅ **Backend Foundation**
- Express server with API structure
- JWT authentication (register/login)
- Database schema with gamification support
- CORS & error handling

✅ **Frontend Foundation**
- React with modern tooling
- Responsive design
- Home page with features showcase
- Authentication pages (Login/Register)
- Courses listing page
- Student dashboard template

✅ **Database**
- PostgreSQL schema ready
- Tables for users, courses, lessons, gamification, progress
- Supports 10+ core features

---

## 🚀 Phase 2 Tasks (Starting Now)

Coming in Phase 2:
- [ ] Lesson management system
- [ ] Browser-based code editor
- [ ] Code execution service
- [ ] Progress tracking dashboard
- [ ] Quiz/LSS system
- [ ] Course enrollment

---

## 🔗 Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/courses | List courses |
| GET | /api/courses/:id | Course details |

---

## 📚 Full Documentation

- **PROJECT_ROADMAP.md** - Complete roadmap & architecture
- **SETUP_GUIDE.md** - Detailed setup instructions
- **This file** - Quick start

---

## ❓ Common Issues

| Problem | Solution |
|---------|----------|
| Database error | Create database: `CREATE DATABASE algoveda;` |
| Port in use | Change PORT in .env or kill process |
| Blank page | Check browser console for errors |
| API connection | Verify backend running on port 5000 |

---

## 🎓 Technology Stack

- **Frontend**: React.js + Vite + CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt

---

**Next**: Read PROJECT_ROADMAP.md for full details → Continue with Phase 2! 🚀
