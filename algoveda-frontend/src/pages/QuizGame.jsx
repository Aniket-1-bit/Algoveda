import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { quizAPI } from '../services/api';
import '../styles/quiz-game.css';

export const QuizGame = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Sample quiz questions
  const sampleQuestions = [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      correct_answer: "Hyper Text Markup Language"
    },
    {
      id: 2,
      question: "Which company developed JavaScript?",
      options: [
        "Mozilla",
        "Netscape",
        "Sun Microsystems",
        "Microsoft"
      ],
      correct_answer: "Netscape"
    },
    {
      id: 3,
      question: "What is the correct way to declare a JavaScript variable?",
      options: [
        "variable myVar;",
        "var myVar;",
        "v myVar;",
        "declare myVar;"
      ],
      correct_answer: "var myVar;"
    },
    {
      id: 4,
      question: "Which CSS property is used to change the text color?",
      options: [
        "font-color",
        "text-color",
        "color",
        "fgcolor"
      ],
      correct_answer: "color"
    },
    {
      id: 5,
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correct_answer: "Cascading Style Sheets"
    }
  ];

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !showScore) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showScore) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, showScore]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowScore(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
    setTimeLeft(30);
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="quiz-game">
        <div className="quiz-intro">
          <h1>🧠 Coding Quiz Challenge</h1>
          <p>Test your knowledge with this fun quiz game!</p>
          <div className="quiz-stats">
            <div className="stat-card">
              <h3>5</h3>
              <p>Questions</p>
            </div>
            <div className="stat-card">
              <h3>30s</h3>
              <p>Per Question</p>
            </div>
            <div className="stat-card">
              <h3>🏆</h3>
              <p>Leaderboard</p>
            </div>
          </div>
          <button className="btn-primary btn-large" onClick={startGame}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-game">
      {showScore ? (
        <div className="quiz-results">
          <h1>Quiz Completed! 🎉</h1>
          <div className="score-display">
            <div className="score-circle">
              <span className="score">{score}</span>
              <span className="total">/{questions.length}</span>
            </div>
            <p>You scored {score} out of {questions.length} questions correctly!</p>
            {score === questions.length ? (
              <div className="perfect-score">
                <p>🏆 Perfect Score! You're a coding genius!</p>
              </div>
            ) : score >= questions.length / 2 ? (
              <p>👏 Well done! Keep practicing to improve!</p>
            ) : (
              <p>📚 Keep learning and try again!</p>
            )}
          </div>
          <div className="quiz-actions">
            <button className="btn-primary" onClick={restartGame}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : questions.length > 0 ? (
        <div className="quiz-active">
          <div className="quiz-header">
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="quiz-info">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <div className="timer">
                <span className={timeLeft <= 10 ? 'timer-warning' : ''}>
                  ⏰ {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          <div className="question-section">
            <h2>{questions[currentQuestion].question}</h2>
            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    selectedAnswer === option 
                      ? option === questions[currentQuestion].correct_answer 
                        ? 'correct' 
                        : 'incorrect'
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {selectedAnswer && (
              <div className="feedback">
                <button className="btn-primary" onClick={handleNextQuestion}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">Loading quiz questions...</div>
      )}
    </div>
  );
};