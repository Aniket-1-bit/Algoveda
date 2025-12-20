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

  // Mock Logic: Determine if course is Premium (same as Courses.jsx)
  const isPremium = course.id % 2 !== 0 ? false : true; // Even IDs are Premium
  const isEnrolled = false;

  // MOCK LESSONS if none exist (Ensure content appears)
  const displayLessons = (course.lessons && course.lessons.length > 0) ? course.lessons : [
    { id: 101, title: 'Introduction & Setup', description: 'Getting started with the course environment.', estimated_duration_minutes: 15 },
    { id: 102, title: 'Core Concepts', description: 'Understanding the fundamentals.', estimated_duration_minutes: 45 },
    { id: 103, title: 'Hands-on Practice', description: 'Building your first project.', estimated_duration_minutes: 60 },
    { id: 104, title: 'Advanced Topics', description: 'Deep dive into complex features.', estimated_duration_minutes: 50 },
    { id: 105, title: 'Final Project', description: 'Putting it all together.', estimated_duration_minutes: 90 },
  ];

  const handleStartFreeCourse = () => {
    // Should redirect to the first lesson
    if (displayLessons.length > 0) {
      window.location.href = `/courses/${courseId}/lessons/${displayLessons[0].id}`;
    }
  };

  return (
    <div className="course-detail">
      <div className="course-header">
        <Link to="/courses" className="back-button">
          ← Back to Courses
        </Link>
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1>{course.title}</h1>
            {isPremium ?
              <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>PREMIUM</span>
              :
              <span style={{ background: '#D1FAE5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>FREE</span>
            }
          </div>
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
          <h2>📚 Lessons {isPremium && !isEnrolled && <span style={{ fontSize: '0.9rem', color: '#EF4444' }}>(Enroll to unlock all)</span>}</h2>

          <div className="lessons-list">
            {displayLessons.map((lesson, index) => {
              // First lesson is always free (Demo)
              const isLocked = isPremium && !isEnrolled && index > 0;

              return isLocked ? (
                <div key={lesson.id} className="lesson-item locked" style={{ opacity: 0.7, cursor: 'not-allowed', background: '#f9fafb' }}>
                  <div className="lesson-number">🔒</div>
                  <div className="lesson-info">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description || 'No description'}</p>
                    <span className="lesson-duration">
                      ⏱️ {lesson.estimated_duration_minutes || 30} minutes
                    </span>
                  </div>
                  <div className="lesson-arrow" style={{ color: '#9CA3AF' }}>Locked</div>
                </div>
              ) : (
                <Link
                  key={lesson.id}
                  to={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="lesson-item"
                >
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-info">
                    <h3>{lesson.title} {index === 0 && isPremium && <span style={{ color: 'green', fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Free Demo)</span>}</h3>
                    <p>{lesson.description || 'No description'}</p>
                    <span className="lesson-duration">
                      ⏱️ {lesson.estimated_duration_minutes || 30} minutes
                    </span>
                  </div>
                  <div className="lesson-arrow">→</div>
                </Link>
              );
            })}
          </div>

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
            <div className="info-item">
              <span className="label">Type:</span>
              <span className="value" style={{ fontWeight: 'bold', color: isPremium ? '#D97706' : '#059669' }}>
                {isPremium ? 'Premium ($49.99)' : 'Free'}
              </span>
            </div>
            {course.prerequisites && (
              <div className="info-item">
                <span className="label">Prerequisites:</span>
                <span className="value">{course.prerequisites}</span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Total Lessons:</span>
              <span className="value">{displayLessons.length}</span>
            </div>
          </div>

          {isPremium && !isEnrolled && (
            <Link to={`/enroll/${courseId}`} className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
              Enroll Now ($49.99)
            </Link>
          )}

          {!isPremium && (
            <button onClick={handleStartFreeCourse} className="btn-primary" style={{ width: '100%', cursor: 'pointer' }}>
              Start Learning Now
            </button>
          )}

          {(isEnrolled) && (
            <button className="btn-primary" style={{ width: '100%', opacity: 0.8, cursor: 'default' }}>
              Enrolled
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
