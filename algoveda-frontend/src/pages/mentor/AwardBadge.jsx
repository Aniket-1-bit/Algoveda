import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const AwardBadge = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Award Badge</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                <h2>Recognize Achievement</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Select a student and a badge to award.</p>
                <button className="btn-primary" onClick={() => { alert('Badge Awarded!'); navigate('/mentor-portal'); }}>Award Badge</button>
            </div>
        </div>
    );
};
