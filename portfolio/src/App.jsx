import './App.css'

function App() {
  return (
    <div className="portfolio">
      {/* Header Section */}
      <header className="header">
        <nav className="nav">
          <h2 className="logo">Portfolio</h2>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Hi, I'm <span className="highlight">Your Name</span></h1>
          <p className="hero-subtitle">Web Developer | Designer | Creative Thinker</p>
          <a href="#contact" className="cta-button">Get In Touch</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <h2 className="section-title">About Me</h2>
        <p className="about-text">
          I'm a passionate web developer with a keen eye for design and a love for creating 
          beautiful, functional websites. I specialize in modern web technologies and enjoy 
          turning ideas into reality.
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>Project One</h3>
            <p>A description of your amazing project and the technologies used.</p>
            <div className="project-tags">
              <span className="tag">React</span>
              <span className="tag">CSS</span>
            </div>
          </div>
          <div className="project-card">
            <h3>Project Two</h3>
            <p>Another awesome project showcasing your skills and creativity.</p>
            <div className="project-tags">
              <span className="tag">JavaScript</span>
              <span className="tag">HTML</span>
            </div>
          </div>
          <div className="project-card">
            <h3>Project Three</h3>
            <p>A third project that demonstrates your expertise and passion.</p>
            <div className="project-tags">
              <span className="tag">Node.js</span>
              <span className="tag">API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          <div className="skill">HTML5</div>
          <div className="skill">CSS3</div>
          <div className="skill">JavaScript</div>
          <div className="skill">React</div>
          <div className="skill">Node.js</div>
          <div className="skill">Git</div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact">
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-text">I'd love to hear from you! Feel free to reach out.</p>
        <div className="contact-links">
          <a href="mailto:your.email@example.com" className="contact-link">Email</a>
          <a href="https://github.com/yourusername" target="_blank" className="contact-link">GitHub</a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" className="contact-link">LinkedIn</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Your Name. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
