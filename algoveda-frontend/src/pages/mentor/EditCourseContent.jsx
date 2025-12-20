import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/dashboard.css';

export const EditCourseContent = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([
        { id: 1, title: 'Introduction', lessons: ['Welcome', 'Setup'] },
        { id: 2, title: 'Core Concepts', lessons: ['State', 'Props'] }
    ]);

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1>Edit Content</h1>
            </div>

            <div className="dashboard-card">
                <h2>Course Modules</h2>
                <div style={{ marginTop: '1rem' }}>
                    {modules.map(mod => (
                        <div key={mod.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <b>{mod.title}</b>
                                <button className="btn-small">Edit</button>
                            </div>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-light)' }}>
                                {mod.lessons.map((lesson, idx) => (
                                    <li key={idx}>{lesson}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button className="btn-primary">+ Add Module</button>
                </div>
            </div>
        </div>
    );
};
