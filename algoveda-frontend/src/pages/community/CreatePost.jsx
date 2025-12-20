import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/community.css';

export const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            title,
            content,
            author: user?.full_name || "Anonymous",
            avatar: (user?.full_name || "A").charAt(0),
            timestamp: "Just now",
            replies: 0,
            likes: 0,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            comments: [] // Array to store replies
        };

        const existing = JSON.parse(localStorage.getItem('community_posts') || '[]');
        localStorage.setItem('community_posts', JSON.stringify([newPost, ...existing]));

        navigate('/community');
    };

    return (
        <div className="community-page page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Start a Discussion</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                        <input
                            type="text"
                            required
                            placeholder="What's on your mind?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content</label>
                        <textarea
                            required
                            rows="6"
                            placeholder="Elaborate on your topic..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. React, JavaScript, Career"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Post Discussion</button>
                </form>
            </div>
        </div>
    );
};
