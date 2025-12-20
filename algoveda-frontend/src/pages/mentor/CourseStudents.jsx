import { Link, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';

export const CourseStudents = () => {
    const { courseId } = useParams();
    const students = [
        { id: 1, name: 'Alice Smith', progress: 85, lastActive: '2 hours ago' },
        { id: 2, name: 'Bob Johnson', progress: 45, lastActive: '1 day ago' },
        { id: 3, name: 'Charlie Brown', progress: 10, lastActive: '3 days ago' },
    ];

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1>Enrolled Students</h1>
            </div>

            <div className="dashboard-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Progress</th>
                            <th style={{ padding: '1rem' }}>Last Active</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{student.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '100px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${student.progress}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                                        </div>
                                        <span>{student.progress}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{student.lastActive}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn-small">Message</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
