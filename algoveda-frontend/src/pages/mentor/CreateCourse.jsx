import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css'; // Reusing dashboard styles for consistency

export const CreateCourse = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            alert(`Course "${title}" created successfully!`);
            navigate('/mentor-portal');
        }, 1000);
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create New Course</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Course Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            required
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Create Course</button>
                </form>
            </div>
        </div>
    );
};
