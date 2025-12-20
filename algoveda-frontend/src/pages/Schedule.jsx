import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/dashboard.css';

export const Schedule = () => {
    const { user } = useAuth();
    const isMentor = user?.user_type === 'mentor';

    // Mock data for student schedule
    const studentLessons = [
        { id: 1, title: "Advanced React Hooks", course: "React Mastery", time: "Today, 4:00 PM", instructor: "Sarah Drasner" },
        { id: 2, title: "Graph Algorithms", course: "Data Structures & Algorithms", time: "Tomorrow, 2:00 PM", instructor: "Aditya Bhargava" },
        { id: 3, title: "System Design Practice", course: "System Design Interview Prep", time: "Fri, 10:00 AM", instructor: "Alex Xu" },
        { id: 4, title: "Database Sharding", course: "Backend Engineering", time: "Mon, 11:00 AM", instructor: "Martin Kleppmann" },
        { id: 5, title: "CSS Grid Layouts", course: "Web Design", time: "Tue, 1:00 PM", instructor: "Jen Simmons" },
    ];

    // Mock data for mentor schedule
    const mentorLessons = [
        { id: 1, title: "React State Management", course: "Advanced React", time: "Today, 5:00 PM", type: "Live Session" },
        { id: 2, title: "Database Normalization", course: "SQL Fundamentals", time: "Tomorrow, 11:00 AM", type: "Q&A Session" },
        { id: 3, title: "Code Review Session", course: "Full Stack Bootcamp", time: "Fri, 2:00 PM", type: "Code Review" },
        { id: 4, title: "Weekly Sync", course: "Team Meeting", time: "Mon, 9:00 AM", type: "Internal" },
    ];

    const lessons = isMentor ? mentorLessons : studentLessons;

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
                <h1>{isMentor ? 'Teaching Schedule' : 'Full Schedule'}</h1>
            </div>

            <div className="dashboard-card" style={{ marginTop: '2rem' }}>
                <div className="lessons-list">
                    {lessons.map(lesson => (
                        <div key={lesson.id} className="lesson-item">
                            <div className="lesson-date">
                                <span className="date-text">{lesson.time.split(',')[0]}</span>
                                <span className="time-text">{lesson.time.split(',')[1]}</span>
                            </div>
                            <div className="lesson-details">
                                <h4 className="lesson-title" style={{ marginBottom: '0.5rem' }}>{lesson.title}</h4>
                                <p className="course-name" style={{ marginBottom: '0.25rem' }}>{lesson.course}</p>
                                <p className="instructor-name">
                                    {isMentor ? `Type: ${lesson.type}` : `with ${lesson.instructor}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
