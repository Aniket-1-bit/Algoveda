import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/dashboard.css';

export const EditModule = () => {
    const { courseId, moduleId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState(searchParams.get('title') || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update local storage simulation
        const key = `course_${courseId}_modules`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.map(m => m.id.toString() === moduleId ? { ...m, title } : m);
        localStorage.setItem(key, JSON.stringify(updated));

        navigate(`/mentor/course/${courseId}/edit`);
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Edit Module</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Module Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    );
};
