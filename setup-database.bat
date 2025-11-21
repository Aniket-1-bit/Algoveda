@echo off
echo ========================================
echo ALGOVEDA Database Setup Script
echo ========================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL is not installed or not in PATH!
    echo.
    echo Please install PostgreSQL 14 or higher from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add PostgreSQL bin folder to PATH:
    echo Example: C:\Program Files\PostgreSQL\14\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.
echo Please enter your PostgreSQL superuser password when prompted.
echo.

REM Create database
echo Creating database 'algoveda'...
psql -U postgres -c "CREATE DATABASE algoveda;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database 'algoveda' created successfully!
) else (
    echo Database 'algoveda' already exists or creation failed.
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env file with your PostgreSQL password
echo 2. Run: cd algoveda-backend
echo 3. Run: npm install
echo 4. Run: node server.js
echo 5. Run: node scripts/seed.js (to add sample data)
echo.
pause
