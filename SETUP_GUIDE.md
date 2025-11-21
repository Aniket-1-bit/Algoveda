# ALGOVEDA Setup & Running Guide

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager
- Git (for version control)

---

## 📦 Installation & Setup

### Step 1: Setup PostgreSQL Database

1. **Create the database:**
```bash
psql -U postgres
CREATE DATABASE algoveda;
\q
```

2. **Verify connection:**
```bash
psql -U postgres -d algoveda
```

---

### Step 2: Setup Backend

1. **Navigate to backend directory:**
```bash
cd d:\Algoveda\algoveda-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables (.env):**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=algoveda
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Code Execution Service
CODE_EXECUTION_PORT=6000
```

4. **Start the backend server:**
```bash
npm run dev
```

Expected output:
```
Server is running on http://localhost:5000
Environment: development
Database schema initialized successfully
```

---

### Step 3: Setup Frontend

1. **Open a new terminal, navigate to frontend directory:**
```bash
cd d:\Algoveda\algoveda-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd d:\Algoveda\algoveda-backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd d:\Algoveda\algoveda-frontend
npm run dev
# Runs on http://localhost:3000
```

### Production Build

**Frontend:**
```bash
cd d:\Algoveda\algoveda-frontend
npm run build
npm run preview
```

---

## 🧪 Testing the Application

### 1. Register a New Account
- Visit: http://localhost:3000/register
- Fill in username, email, password
- Select "Student" or "Mentor" account type
- Click "Sign Up"

### 2. Login
- Visit: http://localhost:3000/login
- Enter email and password
- Click "Login"

### 3. Navigate Features
- **Home**: http://localhost:3000/
- **Courses**: http://localhost:3000/courses
- **Dashboard**: http://localhost:3000/dashboard (requires login)

### 4. Test API Endpoints

**Register (via Postman/Insomnia):**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User",
  "user_type": "student"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Get Courses:**
```bash
GET http://localhost:5000/api/courses
```

**Get Course Details:**
```bash
GET http://localhost:5000/api/courses/1
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Verify PostgreSQL is running: `psql --version`
- Check database credentials in `.env`
- Ensure database exists: `psql -l | grep algoveda`
- Restart PostgreSQL service

### Issue: "Port 5000 or 3000 already in use"
**Solution:**
```bash
# Kill process on specific port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env and vite.config.js
```

### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: CORS errors
**Solution:**
- Ensure backend .env has correct PORT
- Check vite.config.js proxy configuration
- Frontend should proxy `/api` to `http://localhost:5000`

---

## 📋 Project Structure Verification

Verify your project structure matches:

```
d:\Algoveda\
├── algoveda-backend/
│   ├── config/
│   │   ├── database.js
│   │   └── schema.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── courseController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── courseRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── algoveda-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── PROJECT_ROADMAP.md
└── SETUP_GUIDE.md
```

---

## 🎯 Next Steps

After successful setup:

1. **Test Authentication**
   - Create an account
   - Login with credentials
   - Verify token in localStorage

2. **Explore API**
   - Use Postman to test endpoints
   - Review response structures
   - Check error handling

3. **Continue Development**
   - Follow Phase 2 tasks in PROJECT_ROADMAP.md
   - Implement lesson management
   - Build coding environment

---

## 📚 Useful Commands

```bash
# Start both servers (from project root, requires 2 terminals)
# Terminal 1:
cd algoveda-backend && npm run dev

# Terminal 2:
cd algoveda-frontend && npm run dev

# View logs:
# Backend logs appear in Terminal 1
# Frontend build logs appear in Terminal 2

# Database CLI:
psql -U postgres -d algoveda

# View database tables:
\dt

# Exit PostgreSQL:
\q
```

---

## 🔐 Security Notes

⚠️ **Important for Development Only:**

- Current `.env` contains placeholder credentials
- Change `JWT_SECRET` in production
- Never commit `.env` to git (already in .gitignore)
- Use strong passwords
- Enable HTTPS in production
- Implement rate limiting
- Use environment-specific configurations

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review PROJECT_ROADMAP.md for architecture details
3. Check backend console for error messages
4. Verify browser console for frontend errors

---

**Happy Coding! 🚀**
