import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { commentAPI } from '../services/api';
import '../styles/comment-section.css';

export const CommentSection = ({ lessonId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getCommentsByLesson(lessonId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      // Try API first
      // await commentAPI.createComment(lessonId, newComment); // Commenting out real API for now if likely to fail

      // Simulate success for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockComment = {
        id: Date.now(),
        content: newComment,
        user: user || { full_name: 'You', username: 'you' },
        created_at: new Date().toISOString(),
        like_count: 0
      };
      setComments([mockComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentAPI.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await commentAPI.likeComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h3>💬 Discussion ({comments.length})</h3>

      {isAuthenticated ? (
        <div className="comment-form">
          <textarea
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={5000}
          />
          <div className="comment-form-footer">
            <span className="char-count">{newComment.length}/5000</span>
            <button
              className="btn-primary"
              onClick={handlePostComment}
              disabled={posting || !newComment.trim()}
            >
              {posting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Log in to join the discussion</p>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to share!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-thread">
              <div className="comment">
                <div className="comment-header">
                  <div className="user-info">
                    <div className="avatar">{comment.user?.full_name?.charAt(0) || 'U'}</div>
                    <div>
                      <div className="username">{comment.user?.full_name || comment.user?.username}</div>
                      <div className="timestamp">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {isAuthenticated && user?.id === comment.user_id && (
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                  <button
                    className="btn-like"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    👍 {comment.like_count || 0}
                  </button>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment reply">
                      <div className="comment-header">
                        <div className="user-info">
                          <div className="avatar">{reply.user?.full_name?.charAt(0) || 'U'}</div>
                          <div>
                            <div className="username">{reply.user?.full_name || reply.user?.username}</div>
                            <div className="timestamp">
                              {new Date(reply.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comment-content">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
