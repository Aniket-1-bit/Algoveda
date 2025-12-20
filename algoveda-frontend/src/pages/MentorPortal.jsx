import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mentorAPI } from '../services/api';
import '../styles/mentor-portal.css';

export const MentorPortal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_type !== 'mentor') {
      return;
    }
    fetchMentorData();
  }, [user]);

  const fetchMentorData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        mentorAPI.getMentorStats(),
        mentorAPI.getMentorCourses(),
      ]);

      setStats(statsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Failed to fetch mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.user_type !== 'mentor') {
    return (
      <div className="mentor-access-denied">
        <h2>Access Denied</h2>
        <p>This page is only accessible to mentors.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="mentor-loading">Loading mentor portal...</div>;
  }

  return (
    <div className="mentor-portal">
      <div className="mentor-header">
        <h1>👨‍🏫 Mentor Portal</h1>
        <p>Welcome back, {user?.full_name || user?.username}</p>
      </div>

      {/* Quick Actions - Moved to Top */}
      <div className="mentor-section">
        <h2>🎁 Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/mentor/create-course" className="action-btn">
            <div className="action-icon">➕</div>
            <div className="action-text">Create Course</div>
          </Link>
          <Link to="/mentor/create-challenge" className="action-btn">
            <div className="action-icon">🎯</div>
            <div className="action-text">Create Daily Challenge</div>
          </Link>
          <Link to="/mentor/create-quiz" className="action-btn">
            <div className="action-icon">🎓</div>
            <div className="action-text">Create Quiz</div>
          </Link>
          <Link to="/mentor/award-badge" className="action-btn">
            <div className="action-icon">🏆</div>
            <div className="action-text">Award Badge</div>
          </Link>
        </div>
      </div>

      {stats && (
        <div className="mentor-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Courses Created</h3>
              <div className="stat-value">{stats.courses_created}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <div className="stat-value">47</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Avg Progress</h3>
              <div className="stat-value">{stats.avg_student_progress}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="mentor-section">
        <h2>📖 Your Courses</h2>

        {courses.length > 0 ? (
          <div className="courses-table">
            <div className="table-header">
              <div>Course</div>
              <div>Students</div>
              <div>Progress</div>
              <div>Actions</div>
            </div>

            {/* MOCK DATA SYNCED WITH DASHBOARD */}
            <div className="table-row">
              <div className="course-name">Advanced React</div>
              <div className="student-count">35</div>
              <div className="progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
                <span>45%</span>
              </div>
              <div className="actions">
                <Link to="/mentor/course/1" className="btn-small">View Students</Link>
                <Link to="/mentor/course/1" className="btn-small">Edit</Link>
              </div>
            </div>
            <div className="table-row">
              <div className="course-name">SQL Fundamentals</div>
              <div className="student-count">12</div>
              <div className="progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '30%' }}></div>
                </div>
                <span>30%</span>
              </div>
              <div className="actions">
                <Link to="/mentor/course/2" className="btn-small">View Students</Link>
                <Link to="/mentor/course/2" className="btn-small">Edit</Link>
              </div>
            </div>

            {courses.map((course) => (
              // Render other dynamic courses if any, avoiding duplicates if IDs match
              (course.title !== 'Advanced React' && course.title !== 'SQL Fundamentals') && (
                <div key={course.id} className="table-row">
                  <div className="course-name">{course.title}</div>
                  <div className="student-count">{course.student_count || 0}</div>
                  <div className="progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.avg_progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(course.avg_progress) || 0}%</span>
                  </div>
                  <div className="actions">
                    <Link to={`/mentor/course/${course.id}`} className="btn-small">View Students</Link>
                    <Link to={`/mentor/course/${course.id}`} className="btn-small">Edit</Link>
                  </div>
                </div>
              )))}
          </div>
        ) : (
          <div className="no-courses">
            <p>No courses created yet. Create your first course to get started!</p>
            <button className="btn-primary">Create Course</button>
          </div>
        )}
      </div>
    </div>
  );
};
