# Login Credentials for Algoveda Platform

## Available Accounts

### Admin Account
- **Email**: admin@algoveda.com
- **Password**: Check your `.env` file or use the default if configured
- **Role**: Administrator (full access)

### Mentor Account
- **Email**: mentor@algoveda.com
- **Password**: mentor123
- **Role**: Mentor (can create courses, manage students, award badges)

### Student Account
- **Email**: student@algoveda.com
- **Password**: student123
- **Role**: Student (can enroll in courses, submit assignments)

## How to Use

1. Go to the login page of the Algoveda platform
2. Enter the email and password for the desired role
3. Once logged in, you'll have access based on your role:
   - **Admin**: Access to Admin Portal with user management and system oversight
   - **Mentor**: Access to Mentor Portal where you can create courses, challenges, quizzes, and manage students
   - **Student**: Access to courses, lessons, and learning materials

## Notes
- The mentor account has been specifically created to allow course creation functionality
- Make sure you're logged in as a mentor to access the "Create Course" feature
- The course creation functionality will now properly save courses to the database and make them visible in the overall courses section