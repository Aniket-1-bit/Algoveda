import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/courses.css';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      title: "Node.js Backend Development",
      description: "Build scalable server-side applications with Node.js and Express.",
      votes: 24,
      category: "Backend"
    },
    {
      id: 2,
      title: "JavaScript Basics",
      description: "Core programming concepts with hands-on exercises and projects.",
      votes: 18,
      category: "Programming"
    },
    {
      id: 3,
      title: "Git & GitHub",
      description: "Version control essentials for collaborative development.",
      votes: 15,
      category: "Tools"
    },
    {
      id: 4,
      title: "React.js Mastery",
      description: "Build modern web applications with the most popular JavaScript library.",
      votes: 32,
      category: "Frontend"
    }
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        // Deduplicate courses based on title
        const uniqueCoursesMap = new Map();
        response.data.forEach(course => {
          if (!uniqueCoursesMap.has(course.title)) {
            // Mock Logic: Assign Price Type (Some free, some paid)
            // Let's say courses with odd IDs are Free, even are Paid/Premium
            // Or specific titles to be free
            const isFree = course.id % 2 !== 0;
            uniqueCoursesMap.set(course.title, { ...course, isPremium: !isFree });
          }
        });
        setCourses(Array.from(uniqueCoursesMap.values()));
      } catch (err) {
        setError('Failed to fetch courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const voteForSuggestion = (id) => {
    setSuggestions(suggestions.map(suggestion =>
      suggestion.id === id
        ? { ...suggestion, votes: suggestion.votes + 1 }
        : suggestion
    ));
  };

  if (loading) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Our Courses</h1>
        <p>Master the skills you need to become a successful developer</p>
      </div>

      {/* Course Suggestions Section */}
      <div className="suggestions-section">
        <h2>💡 Course Suggestions</h2>
        {/* Added margin-bottom to prevent overlap */}
        <p style={{ marginBottom: '2rem' }}>Vote for courses you'd like to see added to our platform!</p>

        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="suggestion-card">
              <h3>{suggestion.title}</h3>
              <p>{suggestion.description}</p>
              <div className="suggestion-footer">
                <span className="category-tag">{suggestion.category}</span>
                <button
                  className="vote-button"
                  onClick={() => voteForSuggestion(suggestion.id)}
                >
                  Vote <span className="vote-count">{suggestion.votes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-container">
        <h2>📚 Available Courses</h2>
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
                  <div className="course-badges">
                    <span className={`difficulty ${course.difficulty_level}`}>
                      {course.difficulty_level?.toUpperCase()}
                    </span>
                    {/* Badge for Premium/Free */}
                    <span className={`difficulty ${course.isPremium ? 'advanced' : 'beginner'}`} style={{ backgroundColor: course.isPremium ? '#FEF3C7' : '#D1FAE5', color: course.isPremium ? '#D97706' : '#059669' }}>
                      {course.isPremium ? 'PREMIUM' : 'FREE'}
                    </span>
                  </div>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-info">
                  <span className="duration">⏱️ {course.duration_hours || 0} hours</span>
                  <span className="lessons-count">📚 {course.total_lessons || 12} Lessons</span>
                </div>
                <Link to={`/courses/${course.id}`} className="btn-primary">
                  {course.isPremium ? 'View Details' : 'Start Learning'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};