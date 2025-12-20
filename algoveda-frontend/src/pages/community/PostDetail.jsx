import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/community.css';

export const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [reply, setReply] = useState('');

    useEffect(() => {
        const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const found = posts.find(p => p.id.toString() === postId);

        if (found) {
            setPost(found);
        } else {
            // Fallback for mock posts that aren't in local storage yet
            // In a real app we'd fetch from API
            setPost({
                id: postId,
                title: "Sample Post (Mock)",
                content: "This content was not found in storage.",
                author: "System",
                avatar: "S",
                timestamp: "Unknown",
                tags: [],
                likes: 0,
                comments: []
            });
        }
    }, [postId]);

    const handleReply = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        const newComment = {
            id: Date.now(),
            author: user?.full_name || "You",
            avatar: (user?.full_name || "Y").charAt(0),
            content: reply,
            timestamp: "Just now"
        };

        const updatedPost = { ...post, comments: [...(post.comments || []), newComment], replies: (post.replies || 0) + 1 };
        setPost(updatedPost);
        setReply('');

        // Update storage
        const posts = JSON.parse(localStorage.getItem('community_posts') || '[]');
        const updatedPosts = posts.map(p => p.id.toString() === postId ? updatedPost : p);
        localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    };

    if (!post) return <div className="page-container">Loading...</div>;

    return (
        <div className="community-page page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back to Discussions</button>
            </div>

            <div className="post-card" style={{ marginBottom: '2rem' }}>
                <div className="post-header">
                    <div className="post-author">
                        <div className="avatar">{post.avatar}</div>
                        <div>
                            <div className="author-name">{post.author}</div>
                            <div className="post-time">{post.timestamp}</div>
                        </div>
                    </div>
                </div>
                <div className="post-content">
                    <h1>{post.title}</h1>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{post.content}</p>
                    <div className="post-tags">
                        {post.tags?.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="post-actions" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <span className="likes">👍 {post.likes} Likes</span>
                    <span className="replies">💬 {post.comments?.length || 0} Replies</span>
                </div>
            </div>

            <div className="active-courses" style={{ marginTop: '2rem' }}> {/* Reusing container style */}
                <h3>Replies</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <div key={comment.id} style={{ padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}>{comment.avatar}</div>
                                    <span style={{ fontWeight: 'bold' }}>{comment.author}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>• {comment.timestamp}</span>
                                </div>
                                <p style={{ margin: 0 }}>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No replies yet. Be the first!</p>
                    )}
                </div>

                <form onSubmit={handleReply} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write a reply..."
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                    <button type="submit" className="btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};
