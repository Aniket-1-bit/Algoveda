import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { courseAPI } from '../../services/api';
import '../../styles/dashboard.css'; // Reusing dashboard styles for consistency

export const CreateCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Check if user is authenticated and is a mentor
    if (!user || user.user_type !== 'mentor') {
        return (
            <div className="dashboard page-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Access Denied</h2>
                <p>You must be logged in as a mentor to create courses.</p>
                <button className="btn-primary" onClick={() => navigate('/login')}>Log In</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const courseData = {
                title,
                description,
                difficulty_level: 'beginner', // Default difficulty
                duration_hours: 0, // Default duration
                prerequisites: '' // Default prerequisites
            };
            
            await courseAPI.createCourse(courseData);
            alert(`Course "${title}" created successfully!`);
            navigate('/mentor-portal');
        } catch (err) {
            console.error('Failed to create course:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. You must be a mentor to create courses.');
            } else {
                setError(err.response?.data?.message || 'Failed to create course. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create New Course</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {error && (
                    <div className="error-message" style={{ 
                        color: 'red', 
                        padding: '1rem', 
                        backgroundColor: '#ffe6e6', 
                        borderRadius: '8px', 
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Course Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
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
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Course...' : 'Create Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};
