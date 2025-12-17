import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { CommentSection } from '../components/CommentSection';
import '../styles/lesson-detail.css';

export const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await courseAPI.getLessonById(lessonId);
        setLesson(response.data);
      } catch (err) {
        setError('Failed to load lesson');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return <div className="lesson-loading">Loading lesson...</div>;
  }

  if (error) {
    return <div className="lesson-error">{error}</div>;
  }

  if (!lesson) {
    return <div className="lesson-error">Lesson not found</div>;
  }

  return (
    <div className="lesson-detail">
      <div className="lesson-header">
        <button className="back-button" onClick={() => navigate(`/courses/${courseId}`)}>
          ← Back to Course
        </button>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">
          ⏱️ {lesson.estimated_duration_minutes || 30} minutes
        </p>
      </div>

      <div className="lesson-tabs">
        <button
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📚 Content
        </button>
        <button
          className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          💻 Code Playground
        </button>
        {lesson.quiz && (
          <button
            className={`tab-button ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            📝 Knowledge Check
          </button>
        )}
        <button
          className={`tab-button ${activeTab === 'fun' ? 'active' : ''}`}
          onClick={() => setActiveTab('fun')}
        >
          🎮 Fun Zone
        </button>
      </div>

      <div className="lesson-content-wrapper">
        {activeTab === 'content' && (
          <div className="lesson-content">
            {lesson.description && (
              <div className="description">
                <h2>🎯 Overview</h2>
                <p>{lesson.description}</p>
              </div>
            )}
            {lesson.content && (
              <div className="main-content">
                <h2>📖 Lesson Material</h2>
                <div 
                  className="content-text"
                  dangerouslySetInnerHTML={{ __html: formatContent(lesson.content) }}
                />
              </div>
            )}
            {!lesson.content && !lesson.description && (
              <div className="no-content">
                <p>No content available for this lesson yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && <CodeEditor lessonId={lessonId} />}

        {activeTab === 'quiz' && lesson.quiz && <QuizSection quiz={lesson.quiz} />}

        {activeTab === 'fun' && <FunZone lesson={lesson} />}
      </div>

      <div className="lesson-actions">
        <button className="btn-primary">Complete Lesson</button>
        <button className="btn-secondary">Save Progress</button>
      </div>

      <CommentSection lessonId={lessonId} />
    </div>
  );
};

// Helper function to format content with basic markdown-like syntax
const formatContent = (content) => {
  if (!content) return '';
  
  // Convert **bold** to <strong>
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert `code` to <code>
  content = content.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Convert ## headers to <h3>
  content = content.replace(/^## (.*$)/gm, '<h3>$1</h3>');
  
  // Convert ### headers to <h4>
  content = content.replace(/^### (.*$)/gm, '<h4>$1</h4>');
  
  // Convert --- to <hr>
  content = content.replace(/---/g, '<hr>');
  
  // Convert newlines to <br> (for paragraphs)
  content = content.replace(/\n/g, '<br>');
  
  return content;
};

const CodeEditor = ({ lessonId }) => {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")\n# Try creating a simple function\n');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate code submission
      setTimeout(() => {
        setOutput('✅ Code submitted successfully!\nYour solution has been saved.');
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      setOutput('❌ Error submitting code');
      console.error(error);
      setSubmitting(false);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      if (language === 'python') {
        setOutput('Hello, World!\nProcess finished with exit code 0');
      } else if (language === 'javascript') {
        setOutput('Hello, World!\nundefined');
      } else {
        setOutput('Code executed successfully!');
      }
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="code-editor-section">
      <div className="editor-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button className="btn-secondary" onClick={handleRunCode} disabled={isRunning}>
          {isRunning ? 'Running...' : '▶️ Run Code'}
        </button>
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : '📤 Submit Code'}
        </button>
      </div>

      <div className="editor-container">
        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
        />
      </div>

      {output && (
        <div className="code-output">
          <h3>🖥️ Output</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

const QuizSection = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz.questions || quiz.questions.length === 0) {
      alert('No questions in this quiz');
      return;
    }

    // Calculate score (simple implementation)
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  if (!quiz.questions || quiz.questions.length === 0) {
    return <div className="quiz-section">No questions available for this quiz.</div>;
  }

  return (
    <div className="quiz-section">
      <h2>🧠 Knowledge Check: {quiz.title}</h2>
      {submitted ? (
        <div className="quiz-result">
          <div className="result-badge">
            {score >= 80 ? '🏆 Excellent!' : 
             score >= 60 ? '👍 Good Job!' : 
             '📚 Keep Learning!'}
          </div>
          <h3>Your Score: {score}%</h3>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${score}%`, backgroundColor: score >= 70 ? '#10B981' : '#EF4444' }}
            ></div>
          </div>
          <p>
            {score >= 80 ? '🎉 Outstanding performance! You really mastered this material.' : 
             score >= 60 ? '👏 Nice work! You understand the key concepts.' : 
             '💪 Don\'t worry, review the material and try again.'}
          </p>
          <div className="quiz-actions">
            <button className="btn-secondary" onClick={() => setSubmitted(false)}>
              🔄 Retake Quiz
            </button>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              📚 Review Lesson
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-intro">
            <p>Test your understanding with these questions:</p>
          </div>
          {quiz.questions.map((question, idx) => (
            <div key={question.id} className="quiz-question">
              <h4>❓ Question {idx + 1}: {question.question}</h4>
              <div className="question-options">
                {question.options &&
                  question.options.map((option, optIdx) => (
                    <label key={optIdx} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                      />
                      <span>{String.fromCharCode(65 + optIdx)}. {option}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
          <button className="btn-primary" onClick={handleSubmitQuiz}>
            ✅ Submit Answers
          </button>
        </>
      )}
    </div>
  );
};

const FunZone = ({ lesson }) => {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const activities = [
    {
      id: 1,
      title: "🎯 Code Challenge",
      description: "Solve a mini coding puzzle related to this lesson",
      icon: "💻",
      xp: 50
    },
    {
      id: 2,
      title: "🧠 Flash Cards",
      description: "Review key terms and concepts with interactive flashcards",
      icon: "🃏",
      xp: 30
    },
    {
      id: 3,
      title: "🕵️ Debug Hunt",
      description: "Find and fix errors in sample code",
      icon: "🐛",
      xp: 70
    },
    {
      id: 4,
      title: "🎨 Creative Corner",
      description: "Apply what you learned in a creative project",
      icon: "✨",
      xp: 100
    }
  ];

  const handleActivityComplete = (xp) => {
    setPoints(points + xp);
    setStreak(streak + 1);
    setCurrentActivity(null);
  };

  return (
    <div className="fun-zone">
      <div className="fun-header">
        <h2>🎪 Fun Learning Zone</h2>
        <p>Make learning enjoyable with these interactive activities!</p>
      </div>
      
      <div className="gamification-stats">
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <div className="stat-value">{points}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>
      
      {!currentActivity ? (
        <div className="activities-grid">
          {activities.map(activity => (
            <div 
              key={activity.id} 
              className="activity-card"
              onClick={() => setCurrentActivity(activity)}
            >
              <div className="activity-icon">{activity.icon}</div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <div className="activity-xp">+{activity.xp} XP</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="activity-detail">
          <button className="back-button-fun" onClick={() => setCurrentActivity(null)}>
            ← Back to Activities
          </button>
          <h3>{currentActivity.icon} {currentActivity.title}</h3>
          <p>{currentActivity.description}</p>
          
          {currentActivity.id === 1 && (
            <div className="coding-puzzle">
              <h4>Challenge: Create a function that reverses a string</h4>
              <div className="code-block">
                <pre>
                  {`def reverse_string(s):
    # Your code here
    pass

# Test your function
print(reverse_string("hello"))  # Should print "olleh"`}
                </pre>
              </div>
              <button className="btn-primary" onClick={() => handleActivityComplete(currentActivity.xp)}>
                ✅ I Completed This!
              </button>
            </div>
          )}
          
          {currentActivity.id === 2 && (
            <div className="flash-cards">
              <h4>Flash Card: Key Terms</h4>
              <div className="card-container">
                <div className="flash-card">
                  <div className="card-front">
                    <p>What is a function?</p>
                  </div>
                  <div className="card-back">
                    <p>A reusable block of code that performs a specific task</p>
                  </div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => handleActivityComplete(currentActivity.xp)}>
                ✅ I Know This!
              </button>
            </div>
          )}
          
          {currentActivity.id === 3 && (
            <div className="debug-hunt">
              <h4>Debug Challenge: Find the bug!</h4>
              <div className="code-block">
                <pre>
                  {`# This code should print numbers 1 to 5
for i in range(1, 5):
    print(i)`}
                </pre>
              </div>
              <p>Hint: The loop isn't printing all the numbers it should!</p>
              <button className="btn-primary" onClick={() => handleActivityComplete(currentActivity.xp)}>
                ✅ Found the Bug!
              </button>
            </div>
          )}
          
          {currentActivity.id === 4 && (
            <div className="creative-corner">
              <h4>Creative Project: Apply Your Knowledge</h4>
              <p>Create a small program that uses what you learned today. Be creative!</p>
              <ul>
                <li>Use at least one function</li>
                <li>Include comments explaining your code</li>
                <li>Make it visually interesting</li>
              </ul>
              <button className="btn-primary" onClick={() => handleActivityComplete(currentActivity.xp)}>
                ✅ I Created Something!
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};