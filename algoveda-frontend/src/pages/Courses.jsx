import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import '../styles/courses.css';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Our Courses</h1>
        <p>Master the skills you need to become a successful developer</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-container">
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className={`difficulty ${course.difficulty_level}`}>
                    {course.difficulty_level?.toUpperCase()}
                  </span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-info">
                  <span className="duration">⏱️ {course.duration_hours || 0} hours</span>
                </div>
                <Link to={`/courses/${course.id}`} className="btn-primary">
                  View Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
