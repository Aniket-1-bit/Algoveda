import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cute-ui.css';
import '../styles/dashboard.css';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'ALGOVEDA',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        maxUploadSize: '10',
        sessionTimeout: '30'
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Send to backend
        console.log('Saving settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cute-light-bg)', padding: '2rem 1rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/admin" className="btn-cute-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                        ← Back to Admin Portal
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--cute-text-dark)', marginBottom: '0.5rem' }}>
                        ⚙️ Admin Settings
                    </h1>
                    <p style={{ color: 'var(--cute-text-light)' }}>Configure platform settings and preferences</p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="cute-card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                            General Settings
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="cute-input"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: '600', color: 'var(--cute-text-dark)' }}>
                                        Maintenance Mode
                                    </span>
                                </label>
                                <p style={{ fontSize: '0.875rem', color: 'var(--cute-text-light)', marginTop: '0.5rem', marginLeft: '2rem' }}>
                                    Temporarily disable site access for maintenance
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="cute-card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                            User Settings
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="allowRegistration"
                                        checked={settings.allowRegistration}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: '600', color: 'var(--cute-text-dark)' }}>
                                        Allow New Registrations
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="requireEmailVerification"
                                        checked={settings.requireEmailVerification}
                                        onChange={handleChange}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: '600', color: 'var(--cute-text-dark)' }}>
                                        Require Email Verification
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                    Session Timeout (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="sessionTimeout"
                                    value={settings.sessionTimeout}
                                    onChange={handleChange}
                                    className="cute-input"
                                    min="5"
                                    max="120"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="cute-card" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                            File Upload Settings
                        </h2>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                Max Upload Size (MB)
                            </label>
                            <input
                                type="number"
                                name="maxUploadSize"
                                value={settings.maxUploadSize}
                                onChange={handleChange}
                                className="cute-input"
                                min="1"
                                max="100"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link to="/admin" className="btn-cute-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn-cute">
                            {saved ? '✓ Saved!' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
