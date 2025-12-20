import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/community.css';

export const CreateGroup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(20);
    const [nextMeeting, setNextMeeting] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newGroup = {
            id: Date.now(),
            name,
            description,
            members: 1,
            maxMembers: parseInt(maxMembers),
            nextMeeting: nextMeeting || "TBD"
        };

        const existing = JSON.parse(localStorage.getItem('community_groups') || '[]');
        localStorage.setItem('community_groups', JSON.stringify([...existing, newGroup]));

        const myGroups = JSON.parse(localStorage.getItem('my_groups') || '[]');
        localStorage.setItem('my_groups', JSON.stringify([...myGroups, newGroup.id]));

        navigate('/community');
    };

    return (
        <div className="community-page page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Form a Study Group</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Group Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            required
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Max Members</label>
                            <input
                                type="number"
                                min="2"
                                value={maxMembers}
                                onChange={(e) => setMaxMembers(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>First Meeting (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Tomorrow at 5pm"
                                value={nextMeeting}
                                onChange={(e) => setNextMeeting(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">Create Group</button>
                </form>
            </div>
        </div>
    );
};
