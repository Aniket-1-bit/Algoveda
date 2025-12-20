import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

export const EditCourseContent = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);

    // Load modules (mock + local storage)
    useEffect(() => {
        const stored = localStorage.getItem(`course_${courseId}_modules`);
        if (stored) {
            setModules(JSON.parse(stored));
        } else {
            // Default Mocks
            const defaults = [
                { id: 1, title: 'Introduction', lessons: ['Welcome to the Course', 'Environment Setup'] },
                { id: 2, title: 'Core Concepts', lessons: ['Understanding State', 'Props & Components'] }
            ];
            setModules(defaults);
            localStorage.setItem(`course_${courseId}_modules`, JSON.stringify(defaults));
        }
    }, [courseId]);

    const handleAddLesson = (moduleId) => {
        const lessonTitle = prompt("Enter lesson title:");
        if (lessonTitle) {
            setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, lessonTitle] } : m));
        }
    };

    return (
        <div className="dashboard page-container">
            {/* Header with explicit spacing to prevent overlap */}
            <div className="page-header" style={{
                marginBottom: '3rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'flex-start'
            }}>
                <Link to={`/mentor/course/${courseId}`} className="btn-secondary">← Back to Course</Link>
                <h1 style={{ margin: 0 }}>Edit Content: Syllabus & Grading</h1>
            </div>

            <div className="dashboard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Course Syllabus</h2>
                    <Link to={`/mentor/course/${courseId}/module/new`} className="btn-primary">+ Add Module</Link>
                </div>

                <div className="modules-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {modules.map(mod => (
                        <div key={mod.id} style={{
                            border: '1px solid var(--border-color)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            background: 'var(--card-bg)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                borderBottom: '1px solid var(--border-color)',
                                paddingBottom: '0.5rem'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{mod.title}</h3>
                                <Link
                                    to={`/mentor/course/${courseId}/module/${mod.id}/edit?title=${encodeURIComponent(mod.title)}`}
                                    className="btn-small"
                                >
                                    Edit Title
                                </Link>
                            </div>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 1rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                {mod.lessons.map((lesson, idx) => (
                                    <li key={idx} style={{
                                        padding: '0.5rem',
                                        background: 'var(--light-bg)',
                                        borderRadius: '4px',
                                        fontSize: '0.95rem',
                                        color: 'var(--text-dark)'
                                    }}>
                                        📄 {lesson}
                                    </li>
                                ))}
                                {mod.lessons.length === 0 && (
                                    <li style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No lessons yet.</li>
                                )}
                            </ul>

                            <button
                                className="btn-secondary"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => handleAddLesson(mod.id)}
                            >
                                + Add Lesson
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
