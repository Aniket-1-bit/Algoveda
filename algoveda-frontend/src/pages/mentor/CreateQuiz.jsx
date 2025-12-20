import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const CreateQuiz = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create New Quiz</h1>
            </div>
            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                <h2>Quiz Builder</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Create a multiple-choice quiz to test student knowledge.</p>
                <button className="btn-primary" onClick={() => { alert('Quiz Created!'); navigate('/mentor-portal'); }}>Start Building</button>
            </div>
        </div>
    );
};
