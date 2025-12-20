import { Link } from 'react-router-dom';

export const RecentActivity = ({ activities: propActivities }) => {
    // Mock data for recent activities (default student data)
    const defaultActivities = [
        {
            id: 1,
            type: 'lesson',
            title: 'Completed "React Hooks Deep Dive"',
            timestamp: '2 hours ago',
            xp: '+50 XP',
            icon: '✅'
        },
        {
            id: 2,
            type: 'badge',
            title: 'Earned "Code Warrior" Badge',
            timestamp: 'Yesterday',
            xp: '+100 XP',
            icon: '🏅'
        },
        {
            id: 3,
            type: 'streak',
            title: 'Reached 7-day Streak!',
            timestamp: '2 days ago',
            xp: '+20 XP',
            icon: '🔥'
        },
        {
            id: 4,
            type: 'course',
            title: 'Joined "Data Structure Masterclass"',
            timestamp: '3 days ago',
            xp: '',
            icon: '📚'
        }
    ];

    const activities = propActivities || defaultActivities;

    const getIconStyle = (type) => {
        switch (type) {
            case 'lesson': return 'bg-green-100 text-green-600';
            case 'badge': return 'bg-yellow-100 text-yellow-600';
            case 'streak': return 'bg-red-100 text-red-600';
            case 'course': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="dashboard-card recent-activity">
            <div className="card-header">
                <h3>🕒 Recent Activity</h3>
                <div className="card-icon">📜</div>
            </div>

            <div className="activity-timeline">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="timeline-item">
                        <div className="timeline-connector">
                            <div className={`timeline-icon ${getIconStyle(activity.type)}`}>
                                {activity.icon}
                            </div>
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

            <div className="see-all-link">
                <Link to="/history" className="btn-secondary">
                    View Full History →
                </Link>
            </div>
        </div>
    );
};
