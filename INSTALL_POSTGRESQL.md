# PostgreSQL Installation Guide for Windows

## Quick Install (5 minutes)

### Method 1: Direct Download (Recommended)

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose version 14 or higher (latest stable recommended)
   - Download the Windows x86-64 installer

2. **Run the Installer:**
   - Double-click the downloaded `.exe` file
   - Click "Next" through the setup wizard
   
3. **Installation Settings:**
   - **Installation Directory:** Keep default (`C:\Program Files\PostgreSQL\14`)
   - **Select Components:** Keep all checked (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
   - **Data Directory:** Keep default
   - **Password:** Set a password for the `postgres` superuser
     - ⚠️ **IMPORTANT:** Remember this password! You'll need it for ALGOVEDA
     - Example: `postgres123` (for development only)
   - **Port:** Keep default `5432`
   - **Locale:** Keep default

4. **Complete Installation:**
   - Click "Next" then "Finish"
   - Skip Stack Builder (click "Cancel")

5. **Add PostgreSQL to PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find `Path`, click "Edit"
   - Click "New" and add: `C:\Program Files\PostgreSQL\14\bin`
   - Click "OK" on all windows
   - **Restart Command Prompt** for changes to take effect

6. **Verify Installation:**
   Open a **NEW** Command Prompt and run:
   ```bash
   psql --version
   ```
   
   You should see: `psql (PostgreSQL) 14.x`

---

### Method 2: Using Chocolatey (If you have Chocolatey installed)

```bash
choco install postgresql
```

---

## After Installation - Configure ALGOVEDA

1. **Update Backend .env file:**
   ```bash
   cd d:\Algoveda\algoveda-backend
   notepad .env
   ```

2. **Set your PostgreSQL password:**
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=postgres123
   DB_NAME=algoveda
   DB_PORT=5432
   ```
   Replace `postgres123` with the password you set during installation.

3. **Save and close the file**

---

## Test PostgreSQL Connection

Run this command to verify PostgreSQL is working:

```bash
psql -U postgres -c "SELECT version();"
```

When prompted, enter your PostgreSQL password.

If you see the PostgreSQL version info, you're ready to proceed!

---

## Next Steps

Once PostgreSQL is installed and configured:

```bash
# Navigate to backend
cd d:\Algoveda\algoveda-backend

# Install dependencies
npm install

# Setup database (creates database + tables + sample data)
npm run setup

# Start backend server
npm start
```

Then in a new terminal:
```bash
# Navigate to frontend
cd d:\Algoveda\algoveda-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Your app will be ready at: **http://localhost:3000/**

---

## Troubleshooting

### "psql is not recognized"
- Make sure you added PostgreSQL to PATH (step 5 above)
- Restart Command Prompt after adding to PATH
- Default path: `C:\Program Files\PostgreSQL\14\bin`

### "Password authentication failed"
- Double-check the password in `.env` matches your PostgreSQL password
- Try logging in manually: `psql -U postgres`

### "Could not connect to server"
- Check if PostgreSQL service is running:
  ```bash
  sc query postgresql-x64-14
  ```
- Start the service if stopped:
  ```bash
  sc start postgresql-x64-14
  ```

---

## Alternative: PostgreSQL Portable

If you can't install PostgreSQL system-wide:

1. Download PostgreSQL Portable from: https://github.com/garethflowers/postgresql-portable
2. Extract to a folder (e.g., `C:\PostgreSQL-Portable`)
3. Run `PostgreSQLPortable.exe`
4. Update `.env` with the portable installation path

---

## Ready to Continue!

Once PostgreSQL is installed, return to `SETUP_INSTRUCTIONS.md` for complete setup guide.
