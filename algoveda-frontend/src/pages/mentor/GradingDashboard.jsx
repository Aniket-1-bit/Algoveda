import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

export const GradingDashboard = () => {
    const { courseId } = useParams();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        // Mock data
        const allSubmissions = [
            { id: 1, student: 'Alice Smith', assignment: 'React Components', status: 'Pending', date: 'Oct 12' },
            { id: 2, student: 'Bob Johnson', assignment: 'SQL Queries', status: 'Pending', date: 'Oct 11' },
            { id: 3, student: 'Charlie Brown', assignment: 'State Management', status: 'Pending', date: 'Oct 13' },
        ];

        // Filter out graded ones
        const storedGraded = JSON.parse(localStorage.getItem(`course_${courseId}_graded`) || '[]');
        const pending = allSubmissions.filter(s => !storedGraded.includes(s.id));
        setSubmissions(pending);
    }, [courseId]);

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{
                marginBottom: '3rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'flex-start'
            }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1 style={{ margin: 0 }}>Grading Dashboard</h1>
            </div>

            <div className="dashboard-card">
                <h2>Pending Submissions</h2>
                {submissions.length > 0 ? (
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {submissions.map(sub => (
                            <div key={sub.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.5rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--card-bg)'
                            }}>
                                <div>
                                    <b style={{ fontSize: '1.1rem' }}>{sub.assignment}</b>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                        by <span style={{ color: 'var(--primary-color)' }}>{sub.student}</span> • {sub.date}
                                    </p>
                                </div>
                                <Link
                                    to={`/mentor/course/${courseId}/submission/${sub.id}/grade?student=${encodeURIComponent(sub.student)}&assignment=${encodeURIComponent(sub.assignment)}`}
                                    className="btn-primary"
                                >
                                    Grade
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)', border: '2px dashed var(--border-color)', borderRadius: '8px', marginTop: '1rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎉 All caught up!</p>
                        <p>No pending submissions to grade.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
