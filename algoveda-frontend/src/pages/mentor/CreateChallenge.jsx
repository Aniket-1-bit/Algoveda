import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { challengeAPI } from '../../services/api';
import '../../styles/dashboard.css';

export const CreateChallenge = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [codeTemplate, setCodeTemplate] = useState('');
    const [solution, setSolution] = useState('');
    const [testCases, setTestCases] = useState('');
    const [xpReward, setXpReward] = useState(50);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Check if user is authenticated and is a mentor
    if (!user || user.user_type !== 'mentor') {
        return (
            <div className="dashboard page-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Access Denied</h2>
                <p>You must be logged in as a mentor to create challenges.</p>
                <button className="btn-primary" onClick={() => navigate('/login')}>Log In</button>
            </div>
        );
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const challengeData = {
                title,
                description,
                difficulty,
                code_template: codeTemplate,
                solution,
                test_cases: testCases ? JSON.parse(testCases) : [],
                xp_reward: parseInt(xpReward)
            };
            
            await challengeAPI.createChallenge(challengeData);
            alert(`Daily Challenge "${title}" created successfully!`);
            navigate('/mentor-portal');
        } catch (err) {
            console.error('Failed to create challenge:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. You must be a mentor to create challenges.');
            } else {
                setError(err.response?.data?.message || 'Failed to create challenge. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create Daily Challenge</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Challenge Title *</label>
                        <input 
                            type="text" 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Reverse Linked List" 
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the challenge requirements..." 
                            rows="3"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                        />
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Difficulty</label>
                            <select 
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                disabled={loading}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>XP Reward</label>
                            <input 
                                type="number" 
                                value={xpReward}
                                onChange={(e) => setXpReward(e.target.value)}
                                min="10"
                                max="200"
                                disabled={loading}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Code Template</label>
                        <textarea 
                            value={codeTemplate}
                            onChange={(e) => setCodeTemplate(e.target.value)}
                            placeholder="Provide a starting code template for students..." 
                            rows="5"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }} 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Solution *</label>
                        <textarea 
                            required
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                            placeholder="Provide the solution code..." 
                            rows="5"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }} 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Test Cases (JSON format)</label>
                        <textarea 
                            value={testCases}
                            onChange={(e) => setTestCases(e.target.value)}
                            placeholder='{"inputs": [...], "outputs": [...], "descriptions": [...]}\nExample: {"inputs": [[1,2,3]], "outputs": [[3,2,1]], "descriptions": ["Reverse array"]}' 
                            rows="4"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }} 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Challenge...' : 'Post Challenge'}
                    </button>
                </form>
            </div>
        </div>
    );
};
