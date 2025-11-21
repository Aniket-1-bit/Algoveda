import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import '../styles/course-detail.css';

export const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCoursе] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseAPI.getCourseById(courseId);
        setCoursе(response.data);
      } catch (err) {
        setError('Failed to load course');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="course-loading">Loading course...</div>;
  }

  if (error) {
    return <div className="course-error">{error}</div>;
  }

  if (!course) {
    return <div className="course-error">Course not found</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-header">
        <Link to="/courses" className="back-button">
          ← Back to Courses
        </Link>
        <div className="header-content">
          <h1>{course.title}</h1>
          <div className="course-meta">
            <span className={`difficulty ${course.difficulty_level}`}>
              {course.difficulty_level?.toUpperCase()}
            </span>
            <span className="duration">⏱️ {course.duration_hours || 0} hours</span>
          </div>
          <p className="description">{course.description}</p>
        </div>
      </div>

      <div className="course-content">
        <div className="lessons-section">
          <h2>📚 Lessons</h2>
          {course.lessons && course.lessons.length > 0 ? (
            <div className="lessons-list">
              {course.lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="lesson-item"
                >
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-info">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description || 'No description'}</p>
                    <span className="lesson-duration">
                      ⏱️ {lesson.estimated_duration_minutes || 30} minutes
                    </span>
                  </div>
                  <div className="lesson-arrow">→</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-lessons">
              <p>No lessons available for this course yet.</p>
            </div>
          )}
        </div>

        <div className="course-info-sidebar">
          <div className="info-card">
            <h3>Course Info</h3>
            <div className="info-item">
              <span className="label">Difficulty:</span>
              <span className="value">{course.difficulty_level || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Duration:</span>
              <span className="value">{course.duration_hours || 0} hours</span>
            </div>
            {course.prerequisites && (
              <div className="info-item">
                <span className="label">Prerequisites:</span>
                <span className="value">{course.prerequisites}</span>
              </div>
            )}
          </div>

          <button className="btn-primary" style={{ width: '100%' }}>
            Enroll in Course
          </button>
        </div>
      </div>
    </div>
  );
};
