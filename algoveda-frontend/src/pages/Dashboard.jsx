import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { progressAPI, courseAPI, gamificationAPI } from '../services/api';
import { StudyTimer } from '../components/StudyTimer';
import { UpcomingLessons } from '../components/UpcomingLessons';
import { RecentActivity } from '../components/RecentActivity';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { AIRecommendations } from '../components/AIRecommendations';
import '../styles/dashboard.css';

// --- MOCK DATA CONSTANTS (Moved outside component to prevent re-renders) ---

const mentorLessons = [
  { id: 1, title: "React State Management", course: "Advanced React", time: "Today, 5:00 PM", instructor: "You", reminderSet: true },
  { id: 2, title: "Database Normalization", course: "SQL Fundamentals", time: "Tomorrow, 11:00 AM", instructor: "You", reminderSet: false },
  { id: 3, title: "Code Review Session", course: "Full Stack Bootcamp", time: "Fri, 2:00 PM", instructor: "You", reminderSet: false }
];

const mentorActivity = [
  { id: 1, type: 'course', title: 'Updated "Advanced React" Syllabus', timestamp: '1 hour ago', xp: '', icon: '✏️' },
  { id: 2, type: 'lesson', title: 'Graded 5 Assignments', timestamp: '3 hours ago', xp: '', icon: '✅' },
  { id: 3, type: 'streak', title: 'Resolved 10 Student Doubts', timestamp: 'Yesterday', xp: '', icon: '💬' },
  { id: 4, type: 'badge', title: 'New Review Posted', timestamp: '2 days ago', xp: '', icon: '⭐' }
];

const mockCourses = [
  { id: 1, title: "React Mastery", difficulty_level: "advanced", completion_percentage: 45, completed_lessons: 12, total_lessons: 25 },
  { id: 2, title: "Data Structures & Algorithms", difficulty_level: "intermediate", completion_percentage: 30, completed_lessons: 8, total_lessons: 24 },
  { id: 3, title: "System Design Interview Prep", difficulty_level: "advanced", completion_percentage: 10, completed_lessons: 3, total_lessons: 30 },
];

const mockBadges = [
  { id: 1, name: "Code Warrior", description: "Earned for consistent coding" },
  { id: 2, name: "7-Day Streak", description: "Logged in for 7 days" },
  { id: 3, name: "React Pro", description: "Completed React Basics" },
];

// ---------------------------------------------------------------------------

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalXP: 0,
    currentLevel: 1,
    dailyStreak: 0,
  });
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [badges, setBadges] = useState([]);

  const isMentor = user?.user_type === 'mentor';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If it's a student, we load student-specific mock data
        if (!isMentor) {
          setStats({
            totalXP: 1250,
            currentLevel: 5,
            dailyStreak: 7,
          });

          setBadges(mockBadges);
          setCourses(mockCourses);

          const progressData = {};
          mockCourses.forEach(course => {
            progressData[course.id] = {
              completion_percentage: course.completion_percentage,
              completed_lessons: course.completed_lessons,
              total_lessons: course.total_lessons
            };
          });
          setProgress(progressData);
        } else {
          // For mentor, we might want to fetch other things, but for now it's static
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMentor]);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  // Prepare data for AI recommendations
  const userInterests = ['web development', 'programming', 'algorithms'];
  const completedCourses = Object.keys(progress).filter(courseId => {
    const courseProgress = progress[courseId];
    return courseProgress && courseProgress.completion_percentage === 100;
  }).map(Number);

  const skillLevel = stats.currentLevel <= 3 ? 'beginner' :
    stats.currentLevel <= 6 ? 'intermediate' : 'advanced';

  return (
    <div className="dashboard">
      {/* Animated Background Elements */}
      <div className="dashboard-background">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>

      <div className="dashboard-header">
        <h1>Welcome {isMentor ? '' : 'back, '}{user?.full_name || user?.username}! 👋</h1>
        <p>{isMentor ? 'Manage your courses and track student progress' : 'Your personalized learning dashboard'}</p>
      </div>

      <div className="dashboard-grid">
        {/* MENTOR VIEW: Management Sections */}
        {isMentor && (
          <>
            <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <h3>👨‍🏫 Manage Courses</h3>
                <div className="card-icon">🛠️</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div className="course-progress-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b>Advanced React</b>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>35 Students Enrolled</p>
                  </div>
                  <Link to="/mentor/course/1" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Manage</Link>
                </div>
                <div className="course-progress-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b>SQL Fundamentals</b>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>12 Students Enrolled</p>
                  </div>
                  <Link to="/mentor/course/2" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Manage</Link>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>📈 Student Progress</h3>
                <div className="card-icon">📊</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Alice</b> completed <i>React Hooks</i>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Bob</b> started <i>SQL Indexing</i>
                </li>
                <li style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Charlie</b> scored 90% in Quiz
                </li>
              </ul>
            </div>
          </>
        )}

        {/* STUDENT VIEW: Gamification, Progress, Badges, Quick Actions */}
        {!isMentor && (
          <>
            <div className="dashboard-card gamification">
              <div className="card-header">
                <h3>📊 Your Stats</h3>
                <div className="card-icon">📈</div>
              </div>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalXP.toLocaleString()}</div>
                    <div className="stat-label">Total XP</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.currentLevel}</div>
                    <div className="stat-label">Current Level</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.dailyStreak}</div>
                    <div className="stat-label">Daily Streak</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card progress">
              <div className="card-header">
                <h3>📚 Active Courses</h3>
                <div className="card-icon">📖</div>
              </div>
              {courses.length > 0 ? (
                <div className="courses-progress">
                  {courses.slice(0, 4).map((course) => {
                    const courseProgress = progress[course.id] || {};
                    const completionPercentage = courseProgress.completion_percentage || 0;

                    return (
                      <div key={course.id} className="course-progress-item">
                        <div className="course-header">
                          <div className="course-title">{course.title}</div>
                          <div className="course-difficulty">
                            <span className={`difficulty-badge ${course.difficulty_level}`}>
                              {course.difficulty_level}
                            </span>
                          </div>
                        </div>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <div className="progress-info">
                            <span className="progress-text">
                              {completionPercentage}% complete
                            </span>
                            <span className="lessons-text">
                              ({courseProgress.completed_lessons || 0}/{courseProgress.total_lessons || 0} lessons)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {courses.length > 4 && (
                    <div className="see-all-link">
                      <Link to="/courses" className="btn-secondary">
                        View All Courses →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-content">
                  <div className="placeholder-icon">📘</div>
                  <p>Start a course to track your progress</p>
                  <Link to="/courses" className="btn-primary">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            <div className="dashboard-card badges">
              <div className="card-header">
                <h3>🏆 Achievements ({badges.length})</h3>
                <div className="card-icon">🎖️</div>
              </div>
              {badges.length > 0 ? (
                <div className="badges-container">
                  <div className="badges-list">
                    {badges.slice(0, 8).map((badge) => (
                      <div key={badge.id} className="badge-item" title={badge.description}>
                        <div className="badge-icon">🏅</div>
                        <span className="badge-name">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                  {badges.length > 8 && (
                    <div className="see-all-badges">
                      <Link to="/profile" className="btn-secondary">
                        View All Badges →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-content">
                  <div className="placeholder-icon">🎯</div>
                  <p>Earn your first badge by completing a course!</p>
                  <Link to="/courses" className="btn-primary">
                    Start Learning
                  </Link>
                </div>
              )}
            </div>

            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <h3>🎮 Games & Activities</h3>
                <div className="card-icon">🕹️</div>
              </div>
              <div className="games-grid">
                <Link to="/quiz-game" className="game-card">
                  <div className="game-icon">🧠</div>
                  <div className="game-title">Quiz Challenge</div>
                </Link>
                <Link to="/memory-game" className="game-card">
                  <div className="game-icon">🃏</div>
                  <div className="game-title">Memory Game</div>
                </Link>
                <Link to="/daily-challenge" className="game-card">
                  <div className="game-icon">⚡</div>
                  <div className="game-title">Daily Challenge</div>
                </Link>
                <Link to="/community" className="game-card">
                  <div className="game-icon">👥</div>
                  <div className="game-title">Community</div>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* SHARED BUT DIFFERENTIATED SECTIONS */}
        <UpcomingLessons lessons={isMentor ? mentorLessons : undefined} />
        <RecentActivity activities={isMentor ? mentorActivity : undefined} />
      </div>

      {!isMentor && (
        <>
          {/* AI Recommendations Section */}
          <div className="ai-recommendations-section">
            <div className="section-header">
              <h2>🤖 AI Learning Recommendations</h2>
              <p>Personalized suggestions based on your progress</p>
            </div>
            <AIRecommendations
              userInterests={userInterests}
              completedCourses={completedCourses}
              skillLevel={skillLevel}
            />
          </div>

          {/* Study Timer Section */}
          <div className="study-timer-section">
            <div className="section-header">
              <h2>⏱️ Study Timer</h2>
              <p>Focus on your learning sessions</p>
            </div>
            <StudyTimer />
          </div>
        </>
      )}

    </div>
  );
};