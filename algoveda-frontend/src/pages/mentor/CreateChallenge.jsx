import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const CreateChallenge = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create Daily Challenge</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h2>Daily Challenge Builder</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Define a coding challenge for your students to solve today.</p>
                <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Challenge Title</label>
                    <input type="text" placeholder="e.g., Reverse Linked List" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                <button className="btn-primary" onClick={() => { alert('Challenge Posted!'); navigate('/mentor-portal'); }}>Post Challenge</button>
            </div>
        </div>
    );
};
