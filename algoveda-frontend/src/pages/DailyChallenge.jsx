import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { challengeAPI } from '../services/api';
import '../styles/daily-challenge.css';

export const DailyChallenge = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('# Write your solution here\n');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodayChallenge();
  }, []);

  const fetchTodayChallenge = async () => {
    try {
      const response = await challengeAPI.getTodayChallenge();
      setChallenge(response.data);
      if (response.data.code_template) {
        setCode(response.data.code_template);
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    try {
      const response = await challengeAPI.submitChallenge(challenge.id, code);
      setResult(response.data);
    } catch (error) {
      setResult({ passed: false, message: 'Error submitting challenge' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="challenge-loading">Loading today's challenge...</div>;
  }

  if (!challenge) {
    return (
      <div className="challenge-container">
        <div className="no-challenge">
          <h2>No Challenge Today</h2>
          <p>Come back tomorrow for a new daily challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <div>
          <h1>🎯 Daily Challenge</h1>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div className="challenge-status">
          {challenge.completed && <div className="badge-completed">✓ Completed</div>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-description">
          <h2>{challenge.title}</h2>
          <p>{challenge.description}</p>

          <div className="challenge-details">
            <span className={`difficulty ${challenge.difficulty}`}>
              {challenge.difficulty?.toUpperCase()}
            </span>
            <span className="xp-reward">+{challenge.xp_reward} XP</span>
          </div>

          {challenge.code_template && (
            <div className="template">
              <h3>Code Template</h3>
              <pre>{challenge.code_template}</pre>
            </div>
          )}
        </div>

        <div className="challenge-editor">
          <h3>Solution</h3>
          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            disabled={challenge.completed}
          />

          {!challenge.completed && (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Checking...' : 'Submit'}
            </button>
          )}

          {result && (
            <div className={`result ${result.passed ? 'success' : 'error'}`}>
              <h4>{result.message}</h4>
              {result.passed && (
                <div className="reward">
                  <p>🎉 +{result.xp_earned} XP earned!</p>
                </div>
              )}
            </div>
          )}

          {challenge.completed && (
            <div className="result success">
              <h4>✓ You've completed today's challenge!</h4>
              <p>Come back tomorrow for a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
