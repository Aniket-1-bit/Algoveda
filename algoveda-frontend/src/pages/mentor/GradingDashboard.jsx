import { Link, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';

export const GradingDashboard = () => {
    const { courseId } = useParams();
    const submissions = [
        { id: 1, student: 'Alice Smith', assignment: 'React Components', status: 'Pending', date: 'Oct 12' },
        { id: 2, student: 'Bob Johnson', assignment: 'SQL Queries', status: 'Pending', date: 'Oct 11' },
    ];

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1>Grading Dashboard</h1>
            </div>

            <div className="dashboard-card">
                <h2>Pending Submissions</h2>
                {submissions.length > 0 ? (
                    <div style={{ marginTop: '1rem' }}>
                        {submissions.map(sub => (
                            <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div>
                                    <b>{sub.assignment}</b>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>by {sub.student} • {sub.date}</p>
                                </div>
                                <button className="btn-primary">Grade</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No pending submissions!</p>
                )}
            </div>
        </div>
    );
};
