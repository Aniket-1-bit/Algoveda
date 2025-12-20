import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/dashboard.css';

export const History = () => {
    const { user } = useAuth();
    const isMentor = user?.user_type === 'mentor';

    // Mock history for students
    const studentActivities = [
        { id: 1, title: 'Completed "React Hooks Deep Dive"', timestamp: '2 hours ago', icon: '✅', xp: '+50 XP' },
        { id: 2, title: 'Earned "Code Warrior" Badge', timestamp: 'Yesterday', icon: '🏅', xp: '+100 XP' },
        { id: 3, title: 'Reached 7-day Streak!', timestamp: '2 days ago', icon: '🔥', xp: '+20 XP' },
        { id: 4, title: 'Joined "Data Structure Masterclass"', timestamp: '3 days ago', icon: '📚', xp: '' },
        { id: 5, title: 'Solved "Two Sum" Challenge', timestamp: '4 days ago', icon: '💻', xp: '+30 XP' },
        { id: 6, title: 'Watched "Intro to Python"', timestamp: '5 days ago', icon: '📺', xp: '+10 XP' },
    ];

    // Mock history for mentors
    const mentorActivities = [
        { id: 1, title: 'Updated "Advanced React" Syllabus', timestamp: '1 hour ago', icon: '✏️', xp: '' },
        { id: 2, title: 'Graded 5 Assignments', timestamp: '3 hours ago', icon: '✅', xp: '' },
        { id: 3, title: 'Resolved 10 Student Doubts', timestamp: 'Yesterday', icon: '💬', xp: '' },
        { id: 4, title: 'Added new resource to "SQL Fundamentals"', timestamp: '2 days ago', icon: '📎', xp: '' },
        { id: 5, title: 'Hosted Live Session: "React Patterns"', timestamp: '3 days ago', icon: '🎥', xp: '' },
    ];

    const activities = isMentor ? mentorActivities : studentActivities;

    return (
        <div className="dashboard page-container">
            {/* Animated Background */}
            <div className="dashboard-background">
                <div className="floating-element element-1"></div>
                <div className="floating-element element-2"></div>
                <div className="floating-element element-3"></div>
            </div>

            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
                </div>
                <h1>{isMentor ? 'Teaching Log' : 'Activity History'}</h1>
            </div>

            <div className="dashboard-card" style={{ marginTop: '2rem' }}>
                <div className="activity-timeline">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="timeline-item">
                            <div className="timeline-connector">
                                <div className="timeline-icon bg-gray-100 text-gray-600">{activity.icon}</div>
                                {index !== activities.length - 1 && <div className="timeline-line"></div>}
                            </div>
                            <div className="timeline-content">
                                <div className="activity-header">
                                    <span className="activity-title">{activity.title}</span>
                                    {activity.xp && <span className="activity-xp">{activity.xp}</span>}
                                </div>
                                <span className="activity-time">{activity.timestamp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
