import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { progressAPI, courseAPI, gamificationAPI } from '../services/api';
import { StudyTimer } from '../components/StudyTimer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { AIRecommendations } from '../components/AIRecommendations';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalXP: 0,
    currentLevel: 1,
    dailyStreak: 0,
  });
  const [courses, setCourses] = useState([]);
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user gamification stats
        const statsRes = await gamificationAPI.getUserStats();
        setStats({
          totalXP: statsRes.data.total_xp || 0,
          currentLevel: statsRes.data.current_level || 1,
          dailyStreak: statsRes.data.daily_streak || 0,
        });

        // Fetch user badges
        const badgesRes = await gamificationAPI.getUserBadges();
        setBadges(badgesRes.data || []);

        // Update daily streak
        await gamificationAPI.updateStreak();

        // Fetch courses
        const coursesRes = await courseAPI.getAllCourses();
        setCourses(coursesRes.data || []);

        // Fetch progress for each course
        const progressData = {};
        for (const course of coursesRes.data || []) {
          try {
            const progressRes = await progressAPI.getCourseProgress(course.id);
            progressData[course.id] = progressRes.data;
          } catch (err) {
            console.error(`Failed to fetch progress for course ${course.id}`);
          }
        }
        setProgress(progressData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1>Welcome back, {user?.full_name || user?.username}! 👋</h1>
        <p>Your personalized learning dashboard</p>
      </div>

      <div className="dashboard-grid">
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
      </div>

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

      <section className="recent-activity">
        <div className="section-header">
          <h2>🕒 Recent Activity</h2>
          <p>Your learning journey timeline</p>
        </div>
        <div className="activity-placeholder">
          <div className="placeholder-icon">📜</div>
          <p>No recent activity. Start learning to see your progress here!</p>
          <Link to="/courses" className="btn-primary">
            Begin Learning
          </Link>
        </div>
      </section>
    </div>
  );
};