import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { progressAPI, courseAPI, gamificationAPI } from '../services/api';
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
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.full_name || user?.username}! 👋</h1>
        <p>Your learning dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card gamification">
          <h3>📊 Your Stats</h3>
          <div className="stat-item">
            <span>Total XP</span>
            <div className="stat-value">{stats.totalXP.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <span>Current Level</span>
            <div className="stat-value">{stats.currentLevel}</div>
          </div>
          <div className="stat-item">
            <span>Daily Streak</span>
            <div className="stat-value">{stats.dailyStreak}</div>
          </div>
        </div>

        <div className="dashboard-card progress">
          <h3>📚 Active Courses</h3>
          {courses.length > 0 ? (
            <div className="courses-progress">
              {courses.map((course) => {
                const courseProgress = progress[course.id] || {};
                return (
                  <div key={course.id} className="course-progress-item">
                    <div className="course-title">{course.title}</div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${courseProgress.completion_percentage || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {courseProgress.completion_percentage || 0}% ({courseProgress.completed_lessons || 0}/{courseProgress.total_lessons || 0})
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="placeholder-text">Start a course to track your progress</p>
          )}
        </div>

        <div className="dashboard-card badges">
          <h3>🏆 Achievements ({badges.length})</h3>
          {badges.length > 0 ? (
            <div className="badges-list">
              {badges.map((badge) => (
                <div key={badge.id} className="badge-item" title={badge.name}>
                  <div className="badge-icon">🏅</div>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="badge-placeholder">
              <span>Earn your first badge by completing a course!</span>
            </div>
          )}
        </div>

        <div className="dashboard-card quick-actions">
          <h3>🚀 Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn-secondary">Browse Courses</button>
            <button className="btn-secondary">Daily Challenge</button>
            <button className="btn-secondary">View Leaderboard</button>
          </div>
        </div>
      </div>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-placeholder">
          <p>No recent activity. Start learning to see your progress here!</p>
        </div>
      </section>
    </div>
  );
};
