import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/community.css';

export const CreateEvent = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [maxAttendees, setMaxAttendees] = useState(50);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newEvent = {
            id: Date.now(),
            title,
            date,
            time,
            description,
            attendees: 1, // Creator joins automatically
            maxAttendees: parseInt(maxAttendees),
            isJoined: true // Creator joined logic
        };

        const existing = JSON.parse(localStorage.getItem('community_events') || '[]');
        localStorage.setItem('community_events', JSON.stringify([...existing, newEvent]));

        // Simulating auto-join for creator
        const myEvents = JSON.parse(localStorage.getItem('my_events') || '[]');
        localStorage.setItem('my_events', JSON.stringify([...myEvents, newEvent.id]));

        navigate('/community');
    };

    return (
        <div className="community-page page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Host an Event</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Max Attendees</label>
                        <input
                            type="number"
                            min="1"
                            value={maxAttendees}
                            onChange={(e) => setMaxAttendees(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            required
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary">Create Event</button>
                </form>
            </div>
        </div>
    );
};
