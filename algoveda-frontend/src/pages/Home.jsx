import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AestheticLogo } from '../components/AestheticLogo';
import '../styles/home.css';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  // Sample course recommendations
  const recommendations = [
    {
      id: 1,
      title: "HTML/CSS Fundamentals",
      description: "Learn the building blocks of web development. Perfect for absolute beginners.",
      badge: "New"
    },
    {
      id: 2,
      title: "JavaScript Basics",
      description: "Core programming concepts with hands-on exercises and projects.",
      badge: "Popular"
    },
    {
      id: 3,
      title: "Git & GitHub",
      description: "Version control essentials for collaborative development.",
      badge: "Trending"
    }
  ];

  // Stats for the platform
  const stats = [
    { value: "10K+", label: "Active Learners" },
    { value: "50+", label: "Courses" },
    { value: "100K+", label: "Lessons Completed" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="home">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-student student-with-book student-1"></div>
        <div className="floating-student student-with-computer student-2"></div>
        <div className="floating-student student-happy student-3"></div>
        <div className="floating-student student-with-book student-4"></div>
        <div className="floating-student student-with-computer student-5"></div>
        <div className="floating-student student-happy student-6"></div>
        <div className="floating-student student-with-book student-7"></div>
        <div className="floating-student student-with-computer student-8"></div>
      </div>

      <section className="hero">
        <div className="hero-content">
          {/* Displaying the new aesthetic ALGOVEDA logo with books */}
          <AestheticLogo size="large" />
          
          <h1>Transform Your Future with <span className="highlight">AI-Powered</span> Learning</h1>
          <p>Master coding, algorithms, and data structures through gamified learning experiences designed by experts</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-primary btn-large">
                  Continue Learning
                </Link>
                <Link to="/courses" className="btn-secondary">
                  Explore Courses
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-large">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose ALGOVEDA?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Learning</h3>
            <p>Personalized recommendations based on your progress and learning style</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Gamified Experience</h3>
            <p>Earn XP, unlock badges, and climb the leaderboard while learning</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Interactive Coding</h3>
            <p>Write and execute code directly in your browser with instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Visualize your learning journey with detailed analytics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Achievements</h3>
            <p>Earn badges and certificates as you master new skills</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Support</h3>
            <p>Learn together, compete, and grow with a supportive community</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How ALGOVEDA Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account and set your learning goals</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Personalized Path</h3>
            <p>Our AI recommends the perfect learning path for you</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Learn & Practice</h3>
            <p>Engage with interactive lessons, coding challenges, and quizzes</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Earn Rewards</h3>
            <p>Collect points, badges, and climb the leaderboard</p>
          </div>
        </div>
      </section>

      {/* Course Recommendations Section */}
      <section className="recommendations">
        <h2>🎯 Recommended For You</h2>
        <div className="recommendations-grid">
          {recommendations.map((course) => (
            <div key={course.id} className="recommendation-card">
              <span className="recommendation-badge">{course.badge}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to="/courses" className="btn-primary">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Learners Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <div className="testimonial-content">
              "ALGOVEDA transformed my approach to learning programming. The gamified elements kept me motivated throughout my journey."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">SJ</div>
              <div className="author-info">
                <div className="author-name">Sarah Johnson</div>
                <div className="author-title">Frontend Developer</div>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-content">
              "The AI recommendations helped me discover courses I never would have found on my own. My skills improved dramatically!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">MR</div>
              <div className="author-info">
                <div className="author-name">Michael Rodriguez</div>
                <div className="author-title">Software Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Skills?</h2>
        <p>Join thousands of students mastering computer science fundamentals with AI-powered learning</p>
        <Link to="/register" className="btn-primary btn-large">
          Start Learning Free Today
        </Link>
      </section>
    </div>
  );
};