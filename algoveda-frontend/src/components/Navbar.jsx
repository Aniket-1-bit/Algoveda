import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎓 ALGOVEDA
        </Link>
        <div className="nav-items">
          <Link to="/courses">Courses</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/community">Community</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <Link to="/daily-challenge">Daily Challenge</Link>
              {user?.user_type === 'mentor' && <Link to="/mentor">Mentor Portal</Link>}
              <NotificationBell />
              <span className="user-info">Hi, {user?.username}!</span>
              <button className="btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};