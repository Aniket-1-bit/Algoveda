import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/dashboard.css';

export const MessageStudent = () => {
    const { courseId, studentId } = useParams();
    const [searchParams] = useSearchParams();
    const studentName = searchParams.get('name') || 'Student';
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message sent to ${studentName}!`);
        navigate(`/mentor/course/${courseId}/students`);
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Message Student</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>To: {studentName}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subject</label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
                        <textarea
                            required
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    );
};
