import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { progressAPI, courseAPI, gamificationAPI, mentorAPI } from '../services/api';
import { StudyTimer } from '../components/StudyTimer';
import { UpcomingLessons } from '../components/UpcomingLessons';
import { RecentActivity } from '../components/RecentActivity';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link, Navigate } from 'react-router-dom';
import { AIRecommendations } from '../components/AIRecommendations';
import '../styles/dashboard.css';

// --- MOCK DATA CONSTANTS (Moved outside component to prevent re-renders) ---

const mentorLessons = [
  { id: 1, title: "Python Basics", course: "Python Fundamentals", time: "Today, 5:00 PM", instructor: "You", reminderSet: true },
  { id: 2, title: "Array Operations", course: "Data Structures & Algorithms", time: "Tomorrow, 11:00 AM", instructor: "You", reminderSet: false },
  { id: 3, title: "DOM Manipulation", course: "JavaScript Mastery", time: "Fri, 2:00 PM", instructor: "You", reminderSet: false }
];

const mentorActivity = [
  { id: 1, type: 'course', title: 'Updated "Advanced React" Syllabus', timestamp: '1 hour ago', xp: '', icon: '✏️' },
  { id: 2, type: 'lesson', title: 'Graded 5 Assignments', timestamp: '3 hours ago', xp: '', icon: '✅' },
  { id: 3, type: 'streak', title: 'Resolved 10 Student Doubts', timestamp: 'Yesterday', xp: '', icon: '💬' },
  { id: 4, type: 'badge', title: 'New Review Posted', timestamp: '2 days ago', xp: '', icon: '⭐' }
];

const mockCourses = [
  { id: 1, title: "Python Fundamentals", difficulty_level: "beginner", completion_percentage: 45, completed_lessons: 12, total_lessons: 25, student_count: 5 },
  { id: 2, title: "JavaScript Mastery", difficulty_level: "intermediate", completion_percentage: 30, completed_lessons: 8, total_lessons: 24, student_count: 5 },
  { id: 3, title: "Data Structures & Algorithms", difficulty_level: "advanced", completion_percentage: 10, completed_lessons: 3, total_lessons: 30, student_count: 5 },
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
  const isAdmin = user?.user_type === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If it's a student, fetch real data from the API
        if (!isMentor && !isAdmin) {
          try {
            // Fetch student stats
            const statsRes = await gamificationAPI.getUserStats();
            setStats({
              totalXP: statsRes.data.total_xp || 0,
              currentLevel: statsRes.data.current_level || 1,
              dailyStreak: statsRes.data.daily_streak || 0,
            });
            
            // Fetch student badges
            const badgesRes = await gamificationAPI.getUserBadges();
            setBadges(badgesRes.data || []);
            
            // Fetch enrolled courses
            const coursesRes = await courseAPI.getEnrolledCourses();
            const enrolledCourses = coursesRes.data || [];
            setCourses(enrolledCourses);
            
            // Fetch progress for each course
            const progressData = {};
            for (const course of enrolledCourses) {
              try {
                const progressRes = await progressAPI.getCourseProgress(course.id);
                progressData[course.id] = progressRes.data;
              } catch (progressErr) {
                console.error(`Failed to fetch progress for course ${course.id}:`, progressErr);
                // Fallback progress data
                progressData[course.id] = {
                  completion_percentage: 0,
                  completed_lessons: 0,
                  total_lessons: 10 // default value
                };
              }
            }
            setProgress(progressData);
          } catch (studentErr) {
            console.error('Failed to fetch student data:', studentErr);
            // Fallback to mock data if API fails
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
          }
        } else if (isMentor) {
          // For mentor, fetch actual courses and stats separately for resilience
          try {
            const statsRes = await mentorAPI.getMentorStats();
            setStats({
              totalXP: statsRes.data.courses_created || 0,
              currentLevel: statsRes.data.total_students || 0,
              dailyStreak: statsRes.data.avg_student_progress || 0
            });
          } catch (e) {
            console.error('Failed to fetch mentor stats:', e);
          }

          try {
            const coursesRes = await mentorAPI.getMentorCourses();
            console.log('Fetched mentor courses:', coursesRes.data);
            const data = coursesRes.data && coursesRes.data.length > 0 ? coursesRes.data : mockCourses;
            setCourses(data);
          } catch (e) {
            console.error('Failed to fetch mentor courses:', e);
            // Fallback to mock data in development if API fails
            setCourses(mockCourses);
          }
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMentor, isAdmin, user]);

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
        <h1>Welcome {isMentor || isAdmin ? '' : 'back, '}{user?.full_name || user?.username}! 👋</h1>
        <p>{isAdmin ? 'Your personal admin workspace and activity center' : isMentor ? 'Manage your courses and track student progress' : 'Your personalized learning dashboard'}</p>
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
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div key={course.id} className="course-progress-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <b>{course.title}</b>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {course.student_count || 0} Students Enrolled
                        </p>
                      </div>
                      <Link to={`/mentor/course/${course.id}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Manage</Link>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'center' }}>No courses created yet.</p>
                )}
                {courses.length > 0 && (
                  <Link to="/mentor/portal" className="see-all-link" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textAlign: 'right' }}>
                    View all courses in Portal →
                  </Link>
                )}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>📈 Student Progress</h3>
                <div className="card-icon">📊</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Student 1</b> completed <i>Variables and Data Types</i>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Student 2</b> started <i>Recursion</i>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Student 3</b> scored 95% in JavaScript Quiz
                </li>
                <li style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                  <b>Student 4</b> started <i>Graph Algorithms</i>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* ADMIN VIEW: Personal Admin Workspace */}
        {isAdmin && (
          <>
            <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <h3>📅 Admin Schedule</h3>
                <div className="card-icon">🗓️</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div className="course-progress-item" style={{ borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <b>Platform Maintenance Review</b>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0.25rem 0' }}>
                        Today, 3:00 PM
                      </p>
                    </div>
                    <span className="cute-badge cute-badge-warning">Upcoming</span>
                  </div>
                </div>
                <div className="course-progress-item" style={{ borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <b>User Reports Review</b>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0.25rem 0' }}>
                        Tomorrow, 10:00 AM
                      </p>
                    </div>
                    <span className="cute-badge">Scheduled</span>
                  </div>
                </div>
                <div className="course-progress-item" style={{ borderLeft: '4px solid #ec4899' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <b>Monthly Analytics Meeting</b>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '0.25rem 0' }}>
                        Friday, 2:00 PM
                      </p>
                    </div>
                    <span className="cute-badge">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>✅ Pending Tasks</h3>
                <div className="card-icon">📋</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><b>Review 3 pending role changes</b></span>
                    <span className="cute-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>High</span>
                  </div>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><b>Approve 2 new courses</b></span>
                    <span className="cute-badge cute-badge-warning">Medium</span>
                  </div>
                </li>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><b>Check system logs</b></span>
                    <span className="cute-badge cute-badge-success">Low</span>
                  </div>
                </li>
                <li style={{ padding: '0.75rem 0', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><b>Update platform policies</b></span>
                    <span className="cute-badge cute-badge-success">Low</span>
                  </div>
                </li>
              </ul>
              <Link to="/admin" className="btn-secondary" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                Go to Admin Portal →
              </Link>
            </div>

            <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <h3>📊 Admin Metrics</h3>
                <div className="card-icon">📈</div>
              </div>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">142</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <div className="stat-value">28</div>
                    <div className="stat-label">Active Courses</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💚</div>
                  <div className="stat-info">
                    <div className="stat-value">99.9%</div>
                    <div className="stat-label">System Uptime</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>🕐 Recent Admin Activity</h3>
                <div className="card-icon">📝</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--light-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #10b981' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Promoted user to Mentor</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>2 hours ago</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--light-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #8b5cf6' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Approved new course: Advanced React</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>5 hours ago</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--light-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f59e0b' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Updated platform settings</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>Yesterday</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--light-bg)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #ec4899' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Resolved user support ticket</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>2 days ago</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STUDENT VIEW: Gamification, Progress, Badges, Quick Actions */}
        {!isMentor && !isAdmin && (
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
                  {courses.map((course) => {
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
                  {courses.length > 0 && (
                    <div className="see-all-link">
                      <Link to="/courses" className="btn-secondary">
                        View all courses in Portal →
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
                  <div className="game-content">
                    <div className="game-icon">🧠</div>
                    <div className="game-title">Quiz Challenge</div>
                  </div>
                </Link>
                <Link to="/memory-game" className="game-card">
                  <div className="game-content">
                    <div className="game-icon">🃏</div>
                    <div className="game-title">Memory Game</div>
                  </div>
                </Link>
                <Link to="/daily-challenge" className="game-card">
                  <div className="game-content">
                    <div className="game-icon">⚡</div>
                    <div className="game-title">Daily Challenge</div>
                  </div>
                </Link>
                <Link to="/community" className="game-card">
                  <div className="game-content">
                    <div className="game-icon">👥</div>
                    <div className="game-title">Community</div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* SHARED BUT DIFFERENTIATED SECTIONS - Only for Students and Mentors */}
        {!isAdmin && (
          <>
            <UpcomingLessons lessons={isMentor ? mentorLessons : undefined} />
            <RecentActivity activities={isMentor ? mentorActivity : undefined} />
          </>
        )}
      </div>

      {!isMentor && !isAdmin && (
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