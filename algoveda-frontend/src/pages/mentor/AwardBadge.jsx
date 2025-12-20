import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const AwardBadge = () => {
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedBadge, setSelectedBadge] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    // Mock Data
    const students = [
        { id: 1, name: 'Alice Smith' },
        { id: 2, name: 'Bob Johnson' },
        { id: 3, name: 'Charlie Brown' },
        { id: 4, name: 'Diana Prince' }
    ];

    const badges = [
        { id: 'top-performer', name: '🏆 Top Performer', description: 'Outstanding performance in class' },
        { id: 'code-warrior', name: '⚔️ Code Warrior', description: 'Solved a difficult problem' },
        { id: 'helper', name: '🤝 Community Helper', description: 'Helped peers in discussion' },
        { id: 'bug-hunter', name: '🐛 Bug Hunter', description: 'Found and fixed a critical bug' },
        { id: 'creative', name: '🎨 Creative Mind', description: 'Implemented a unique solution' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedStudent || !selectedBadge) {
            alert("Please select both a student and a badge.");
            return;
        }

        const studentName = students.find(s => s.id === parseInt(selectedStudent))?.name;
        const badgeName = badges.find(b => b.id === selectedBadge)?.name;

        // Persistence
        const award = {
            id: Date.now(),
            studentId: selectedStudent,
            badgeId: selectedBadge,
            message: customMessage,
            date: new Date().toISOString()
        };
        const existing = JSON.parse(localStorage.getItem('mentor_awards') || '[]');
        localStorage.setItem('mentor_awards', JSON.stringify([...existing, award]));

        alert(`Successfully awarded ${badgeName} to ${studentName}!`);
        navigate('/mentor');
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Award Badge</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                    <p style={{ color: 'var(--text-light)' }}>Recognize a student's achievement</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Student Selection */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Student</label>
                        <select
                            required
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        >
                            <option value="">-- Choose a Student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Badge Selection */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Badge</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {badges.map(b => (
                                <div
                                    key={b.id}
                                    onClick={() => setSelectedBadge(b.id)}
                                    style={{
                                        border: selectedBadge === b.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                        background: selectedBadge === b.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--light-bg)',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{b.name.split(' ')[0]}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{b.name.substring(3)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Message */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message (Optional)</label>
                        <textarea
                            rows="3"
                            placeholder="Great job on..."
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Award Badge</button>
                </form>
            </div>
        </div>
    );
};
