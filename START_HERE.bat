@echo off
cls
echo.
echo ========================================
echo    ALGOVEDA SETUP AND LAUNCH
echo ========================================
echo.
echo This script will help you set up and run ALGOVEDA
echo.
pause

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ PostgreSQL is NOT installed
    echo.
    echo 📖 Please follow these steps:
    echo.
    echo 1. Open INSTALL_POSTGRESQL.md in this folder
    echo 2. Follow the installation guide
    echo 3. Run this script again after installation
    echo.
    echo Opening installation guide now...
    timeout /t 3 >nul
    start INSTALL_POSTGRESQL.md
    pause
    exit /b 1
)

echo ✅ PostgreSQL is installed
echo.

REM Check if .env is configured
findstr /C:"your_password" algoveda-backend\.env >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ⚠️  Database password not configured!
    echo.
    echo Please edit algoveda-backend\.env and set your PostgreSQL password:
    echo.
    echo   DB_PASSWORD=your_postgres_password
    echo.
    echo Opening .env file now...
    timeout /t 2 >nul
    notepad algoveda-backend\.env
    echo.
    echo After saving the .env file, run this script again.
    pause
    exit /b 1
)

echo ✅ Configuration file ready
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd algoveda-backend
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\algoveda-frontend
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed
echo.

REM Initialize database
cd ..\algoveda-backend
echo 🗄️  Initializing database...
call npm run init-db
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Database initialization failed!
    echo.
    echo Common issues:
    echo   - Wrong password in .env file
    echo   - PostgreSQL service not running
    echo   - Database already exists (this is OK)
    echo.
    echo Do you want to continue anyway? (Y/N)
    choice /C YN /N
    if errorlevel 2 exit /b 1
)
echo.

REM Seed database
echo 🌱 Adding sample data...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Database seeding failed (might already have data)
    echo.
    echo Do you want to continue? (Y/N)
    choice /C YN /N
    if errorlevel 2 exit /b 1
)
echo.

echo ========================================
echo    STARTING ALGOVEDA
echo ========================================
echo.
echo 🚀 Starting backend server...
start "ALGOVEDA Backend" cmd /k "cd /d d:\Algoveda\algoveda-backend && npm start"
timeout /t 3 >nul

echo 🚀 Starting frontend server...
start "ALGOVEDA Frontend" cmd /k "cd /d d:\Algoveda\algoveda-frontend && npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo    ALGOVEDA IS NOW RUNNING!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000/
echo 🔌 Backend:  http://localhost:5000/
echo.
echo 👤 TEST CREDENTIALS:
echo.
echo Mentor Account:
echo   Email:    john@algoveda.com
echo   Password: mentor123
echo.
echo Student Account:
echo   Email:    student1@algoveda.com
echo   Password: student123
echo.
echo Opening application in browser...
timeout /t 3 >nul
start http://localhost:3000/

echo.
echo Press any key to close this window (servers will keep running)
pause >nul
