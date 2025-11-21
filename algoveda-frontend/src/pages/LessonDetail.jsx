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
          💻 Code Editor
        </button>
        {lesson.quiz && (
          <button
            className={`tab-button ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            📝 Quiz
          </button>
        )}
      </div>

      <div className="lesson-content-wrapper">
        {activeTab === 'content' && (
          <div className="lesson-content">
            {lesson.description && (
              <div className="description">
                <h2>Overview</h2>
                <p>{lesson.description}</p>
              </div>
            )}
            {lesson.content && (
              <div className="main-content">
                <h2>Lesson Content</h2>
                <div className="content-text">{lesson.content}</div>
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
      </div>

      <div className="lesson-actions">
        <button className="btn-primary">Complete Lesson</button>
        <button className="btn-secondary">Save Progress</button>
      </div>

      <CommentSection lessonId={lessonId} />
    </div>
  );
};

const CodeEditor = ({ lessonId }) => {
  const [code, setCode] = useState('# Write your Python code here\n');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [output, setOutput] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Submit code
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          code_content: code,
          language,
        }),
      });

      if (response.ok) {
        setOutput('✅ Code submitted successfully!');
      }
    } catch (error) {
      setOutput('❌ Error submitting code');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>

      <textarea
        className="code-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
      />

      {output && (
        <div className="code-output">
          <h3>Output</h3>
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
      <h2>{quiz.title}</h2>
      {submitted ? (
        <div className="quiz-result">
          <h3>Your Score: {score}%</h3>
          <p>{score >= 70 ? '✅ Great job!' : '❌ Try again'}</p>
          <button className="btn-primary" onClick={() => setSubmitted(false)}>
            Retake Quiz
          </button>
        </div>
      ) : (
        <>
          {quiz.questions.map((question, idx) => (
            <div key={question.id} className="quiz-question">
              <h4>{idx + 1}. {question.question}</h4>
              <div className="question-options">
                {question.options &&
                  question.options.map((option) => (
                    <label key={option} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
          <button className="btn-primary" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
};
