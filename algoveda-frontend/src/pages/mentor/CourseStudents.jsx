import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const CourseStudents = () => {
    const { courseId } = useParams();
    const [students, setStudents] = useState([
        { id: 1, name: 'Alice Smith', progress: 85, lastActive: '2 hours ago' },
        { id: 2, name: 'Bob Johnson', progress: 45, lastActive: '1 day ago' },
        { id: 3, name: 'Charlie Brown', progress: 10, lastActive: '3 days ago' },
    ]);

    const handleMessage = (studentName) => {
        const msg = prompt(`Send message to ${studentName}:`);
        if (msg) {
            alert(`Message sent to ${studentName}!`);
        }
    };

    return (
        <div className="dashboard page-container">
            {/* Extended Header Spacing */}
            <div className="page-header" style={{
                marginBottom: '3rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'flex-start'
            }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1 style={{ margin: 0 }}>Enrolled Students</h1>
            </div>

            <div className="dashboard-card">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--text-light)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Progress</th>
                            <th style={{ padding: '1rem' }}>Last Active</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} style={{ background: 'var(--light-bg)', borderRadius: '8px' }}>
                                <td style={{ padding: '1rem', borderRadius: '8px 0 0 8px', fontWeight: 'bold' }}>{student.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '100px', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${student.progress}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{student.progress}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{student.lastActive}</td>
                                <td style={{ padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                                    <Link
                                        to={`/mentor/course/${courseId}/student/${student.id}/message?name=${encodeURIComponent(student.name)}`}
                                        className="btn-small"
                                    >
                                        Message
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
