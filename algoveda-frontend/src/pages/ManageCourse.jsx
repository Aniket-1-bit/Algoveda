import { Link, useParams } from 'react-router-dom';
import '../styles/dashboard.css';

export const ManageCourse = () => {
    const { courseId } = useParams();

    // Mock course details based on ID
    const courseName = courseId === '1' ? 'Advanced React' : 'SQL Fundamentals';

    return (
        <div className="dashboard page-container">
            {/* Animated Background */}
            <div className="dashboard-background">
                <div className="floating-element element-1"></div>
                <div className="floating-element element-2"></div>
                <div className="floating-element element-3"></div>
            </div>

            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
                <h1 style={{ lineHeight: '1.2' }}>Manage Course: {courseName}</h1>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>📝 Syllabus & Content</h3>
                        <div className="card-icon">📚</div>
                    </div>
                    <p>Edit course modules, add new lessons, and update resources.</p>
                    <Link to={`/mentor/course/${courseId}/edit`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Edit Content</Link>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>👥 Enrolled Students</h3>
                        <div className="card-icon">👨‍🎓</div>
                    </div>
                    <p>View student list, track progress, and manage enrollments.</p>
                    <Link to={`/mentor/course/${courseId}/students`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Students</Link>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>✅ Assignments & Grading</h3>
                        <div className="card-icon">📝</div>
                    </div>
                    <p>Review submissions and assign grades.</p>
                    <Link to={`/mentor/course/${courseId}/grading`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Go to Grading</Link>
                </div>
            </div>
        </div>
    );
};
