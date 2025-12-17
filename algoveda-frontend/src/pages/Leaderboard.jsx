import { useEffect, useState } from 'react';
import { gamificationAPI } from '../services/api';
import '../styles/leaderboard.css';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock leaderboard data with Indian names
  const mockLeaderboard = [
    { id: 1, username: "Shambhawi", full_name: "Shambhawi", total_xp: 3200, current_level: 8, avatar_url: null },
    { id: 2, username: "Gayatri", full_name: "Gayatri Gauswami", total_xp: 2850, current_level: 7, avatar_url: null },
    { id: 3, username: "Khushpreet", full_name: "Khushpreet Kaur", total_xp: 2650, current_level: 7, avatar_url: null },
    { id: 4, username: "Nakul", full_name: "Nakul Gola", total_xp: 2400, current_level: 6, avatar_url: null },
    { id: 5, username: "Aniket", full_name: "Aniket Sain", total_xp: 2100, current_level: 6, avatar_url: null },
    { id: 6, username: "Alex", full_name: "Alex Johnson", total_xp: 1950, current_level: 5, avatar_url: null },
    { id: 7, username: "Sam", full_name: "Sam Wilson", total_xp: 1800, current_level: 5, avatar_url: null },
    { id: 8, username: "Taylor", full_name: "Taylor Reed", total_xp: 1650, current_level: 4, avatar_url: null }
  ];

  useEffect(() => {
    // Using mock data for now, but keeping the API call structure
    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      {/* Animated Background Elements */}
      <div className="leaderboard-background">
        <div className="floating-element el-1"></div>
        <div className="floating-element el-2"></div>
        <div className="floating-element el-3"></div>
      </div>

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
              <div key={entry.id} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
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