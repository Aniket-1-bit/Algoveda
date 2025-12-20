import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/dashboard.css';

export const GradeSubmission = () => {
    const { courseId, submissionId } = useParams();
    const [searchParams] = useSearchParams();
    const studentName = searchParams.get('student') || 'Student';
    const assignment = searchParams.get('assignment') || 'Assignment';

    const navigate = useNavigate();
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Persist grading status
        const key = `course_${courseId}_graded`;
        const graded = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify([...graded, parseInt(submissionId)]));

        alert(`Graded ${assignment} for ${studentName}: ${score}/100`);
        navigate(`/mentor/course/${courseId}/grading`);
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Grade Submission</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px' }}>
                    <p><strong>Assignment:</strong> {assignment}</p>
                    <p><strong>Student:</strong> {studentName}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Score (0-100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Feedback</label>
                        <textarea
                            rows="4"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Submit Grade</button>
                </form>
            </div>
        </div>
    );
};
