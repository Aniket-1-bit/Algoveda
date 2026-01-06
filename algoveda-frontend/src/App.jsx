import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import AdminRoute from './components/AdminRoute';
import AdminPortal from './pages/AdminPortal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { LessonDetail } from './pages/LessonDetail';
import { Leaderboard } from './pages/Leaderboard';
import { DailyChallenge } from './pages/DailyChallenge';
import { MentorPortal } from './pages/MentorPortal';
import { Dashboard } from './pages/Dashboard';
import { QuizGame } from './pages/QuizGame';
import { MemoryGame } from './pages/MemoryGame';
import { Community } from './pages/Community';
import { Schedule } from './pages/Schedule';
import { History } from './pages/History';
import { ManageCourse } from './pages/ManageCourse';
import { Enrollment } from './pages/Enrollment';
import { Payment } from './pages/Payment';
import { EditCourseContent } from './pages/mentor/EditCourseContent';
import { CourseStudents } from './pages/mentor/CourseStudents';
import { GradingDashboard } from './pages/mentor/GradingDashboard';
import { CreateCourse } from './pages/mentor/CreateCourse';
import { CreateChallenge } from './pages/mentor/CreateChallenge';
import { CreateQuiz } from './pages/mentor/CreateQuiz';
import { AwardBadge } from './pages/mentor/AwardBadge';
import { AddModule } from './pages/mentor/AddModule';
import { EditModule } from './pages/mentor/EditModule';
import { MessageStudent } from './pages/mentor/MessageStudent';
import { GradeSubmission } from './pages/mentor/GradeSubmission';
import { CreatePost } from './pages/community/CreatePost';
import { PostDetail } from './pages/community/PostDetail';
import { CreateEvent } from './pages/community/CreateEvent';
import { CreateGroup } from './pages/community/CreateGroup';
function App() {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/daily-challenge" element={<DailyChallenge />} />
            <Route path="/mentor" element={<MentorPortal />} />
            <Route path="/quiz-game" element={<QuizGame />} />
            <Route path="/memory-game" element={<MemoryGame />} />
            <Route path="/mentor/course/:courseId/students" element={<CourseStudents />} />
            <Route path="/mentor/course/:courseId/student/:studentId/message" element={<MessageStudent />} />

            <Route path="/mentor/course/:courseId/grading" element={<GradingDashboard />} />
            <Route path="/mentor/course/:courseId/submission/:submissionId/grade" element={<GradeSubmission />} />

            <Route path="/mentor/course/:courseId/module/new" element={<AddModule />} />
            <Route path="/mentor/course/:courseId/module/:moduleId/edit" element={<EditModule />} />

            <Route path="/mentor/create-course" element={<CreateCourse />} />
            <Route path="/mentor/create-challenge" element={<CreateChallenge />} />
            <Route path="/mentor/create-quiz" element={<CreateQuiz />} />
            <Route path="/mentor/award-badge" element={<AwardBadge />} />

            <Route path="/community" element={<Community />} />
            <Route path="/community/post/new" element={<CreatePost />} />
            <Route path="/community/post/:postId" element={<PostDetail />} />
            <Route path="/community/event/new" element={<CreateEvent />} />
            <Route path="/community/group/new" element={<CreateGroup />} />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminPortal />
              </AdminRoute>
            } />

            <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/enroll/:courseId" element={<PrivateRoute><Enrollment /></PrivateRoute>} />
            <Route path="/payment/:courseId" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/mentor/course/:courseId" element={<PrivateRoute><ManageCourse /></PrivateRoute>} />
            <Route path="/mentor/course/:courseId/edit" element={<PrivateRoute><EditCourseContent /></PrivateRoute>} />
            <Route path="/mentor/course/:courseId/students" element={<PrivateRoute><CourseStudents /></PrivateRoute>} />
            <Route path="/mentor/course/:courseId/grading" element={<PrivateRoute><GradingDashboard /></PrivateRoute>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;