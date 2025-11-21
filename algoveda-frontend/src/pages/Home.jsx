import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/home.css';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ALGOVEDA</h1>
          <p>Master coding, algorithms, and data structures through gamified learning</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-primary btn-large">
                  Go to Dashboard
                </Link>
                <Link to="/courses" className="btn-secondary">
                  Browse Courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-large">
                  Start Learning
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose ALGOVEDA?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Structured Learning</h3>
            <p>Learn in a logical sequence with prerequisites and clear learning outcomes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Gamified Experience</h3>
            <p>Earn XP, unlock badges, and climb the leaderboard while learning</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Code Online</h3>
            <p>Write and execute code directly in your browser with instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Visualize your learning journey with detailed progress analytics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Achievements</h3>
            <p>Earn badges and certificates as you master new skills</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Learn together, compete, and grow with a supportive community</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Start Your Learning Journey?</h2>
        <p>Join thousands of students mastering computer science fundamentals</p>
        <Link to="/register" className="btn-primary btn-large">
          Sign Up Now - It's Free!
        </Link>
      </section>
    </div>
  );
};
