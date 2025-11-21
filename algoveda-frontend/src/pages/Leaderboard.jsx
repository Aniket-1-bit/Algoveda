import { useEffect, useState } from 'react';
import { gamificationAPI } from '../services/api';
import '../styles/leaderboard.css';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await gamificationAPI.getLeaderboard(100);
        setLeaderboard(response.data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>🏆 Global Leaderboard</h1>
        <p>Top learners on ALGOVEDA</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="leaderboard-container">
        {leaderboard.length > 0 ? (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="rank">Rank</div>
              <div className="user">User</div>
              <div className="level">Level</div>
              <div className="xp">XP</div>
            </div>
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="table-row">
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="user">
                  <div className="avatar">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt={entry.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <div className="username">{entry.username}</div>
                    <div className="full-name">{entry.full_name}</div>
                  </div>
                </div>
                <div className="level">
                  <span className="level-badge">Lvl {entry.current_level}</span>
                </div>
                <div className="xp">
                  <span className="xp-value">{entry.total_xp.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No leaderboard data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
