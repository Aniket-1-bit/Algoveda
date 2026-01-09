import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import '../styles/cute-ui.css';
import '../styles/dashboard.css';

const AdminPortal = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        studentCount: 0,
        mentorCount: 0,
        adminCount: 0,
        totalCourses: 0,
        totalSubmissions: 0
    });
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalUsers: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [filterRole, setFilterRole] = useState('all');

    // Modal states
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showSendAlertModal, setShowSendAlertModal] = useState(false);

    // Form states
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        user_type: 'student'
    });

    const [announcement, setAnnouncement] = useState({
        title: '',
        message: '',
        priority: 'normal'
    });

    const [systemHealth] = useState({
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        apiResponseTime: '45ms',
        uptime: '99.9%'
    });

    const [recentActivity] = useState([
        { id: 1, user: 'student1@algoveda.com', action: 'Completed Python Fundamentals', time: '2 min ago', type: 'success' },
        { id: 2, user: 'mentor@algoveda.com', action: 'Created new course', time: '15 min ago', type: 'info' },
        { id: 3, user: 'student2@algoveda.com', action: 'Enrolled in JavaScript', time: '1 hr ago', type: 'info' },
        { id: 4, user: 'student3@algoveda.com', action: 'Earned badge', time: '2 hrs ago', type: 'success' },
        { id: 5, user: 'admin@algoveda.com', action: 'Updated roles', time: '3 hrs ago', type: 'warning' }
    ]);

    useEffect(() => {
        fetchData();
    }, [pagination.page, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, usersData] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers(pagination.page, pagination.limit, searchTerm)
            ]);
            setStats(statsData);
            setUsers(usersData.users);
            setPagination(prev => ({
                ...prev,
                totalPages: usersData.totalPages,
                totalUsers: usersData.totalUsers
            }));
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, user_type: newRole } : user
            ));
        } catch (err) {
            console.error('Failed to update role:', err);
            alert('Failed to update user role');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.addUser(newUser);
            alert(`User ${newUser.username} created successfully!`);
            setShowAddUserModal(false);
            setNewUser({ username: '', email: '', password: '', full_name: '', user_type: 'student' });
            fetchData(); // Refresh user list
        } catch (err) {
            console.error('Failed to add user:', err);
            alert('Failed to add user');
        }
    };

    const handleSendAlert = async (e) => {
        e.preventDefault();
        try {
            await adminService.sendAlert(announcement);
            alert(`Alert "${announcement.title}" sent to all users!`);
            setShowSendAlertModal(false);
            setAnnouncement({ title: '', message: '', priority: 'normal' });
        } catch (err) {
            console.error('Failed to send alert:', err);
            alert('Failed to send alert');
        }
    };

    const handleExportData = () => {
        // Create CSV export
        const csvHeaders = ['ID', 'Username', 'Email', 'Full Name', 'Role', 'Joined Date'];
        const csvRows = users.map(user => [
            user.id,
            user.username,
            user.email,
            user.full_name || '',
            user.user_type,
            new Date(user.created_at).toLocaleDateString()
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `algoveda-users-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('User data exported successfully!');
    };

    const filteredUsers = filterRole === 'all'
        ? users
        : users.filter(user => user.user_type === filterRole);

    if (loading && users.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="cute-spinner"></div>
            </div>
        );
    }

    const totalUsers = stats.studentCount + stats.mentorCount + stats.adminCount;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cute-light-bg)', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background */}
            <div className="dashboard-background">
                <div className="floating-element element-1"></div>
                <div className="floating-element element-2"></div>
                <div className="floating-element element-3"></div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '2.5rem' }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--cute-text-dark)', marginBottom: '0.5rem' }}>
                        🛡️ Admin Control Center
                    </h1>
                    <p style={{ color: 'var(--cute-text-light)', fontSize: '1.125rem' }}>System Management & Oversight</p>
                </motion.div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={activeTab === 'overview' ? 'btn-cute' : 'btn-cute-secondary'}
                    >
                        📊 Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={activeTab === 'users' ? 'btn-cute' : 'btn-cute-secondary'}
                    >
                        👥 Users
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={activeTab === 'analytics' ? 'btn-cute' : 'btn-cute-secondary'}
                    >
                        📈 Analytics
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">👥</div>
                                <div className="cute-stat-value">{totalUsers}</div>
                                <div className="cute-stat-label">Total Users</div>
                            </div>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">👨‍🎓</div>
                                <div className="cute-stat-value">{stats.studentCount}</div>
                                <div className="cute-stat-label">Students</div>
                            </div>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">👨‍🏫</div>
                                <div className="cute-stat-value">{stats.mentorCount}</div>
                                <div className="cute-stat-label">Mentors</div>
                            </div>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">🛡️</div>
                                <div className="cute-stat-value">{stats.adminCount}</div>
                                <div className="cute-stat-label">Admins</div>
                            </div>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">📚</div>
                                <div className="cute-stat-value">{stats.totalCourses}</div>
                                <div className="cute-stat-label">Courses</div>
                            </div>
                            <div className="cute-stat-card">
                                <div className="cute-stat-icon">📝</div>
                                <div className="cute-stat-value">{stats.totalSubmissions}</div>
                                <div className="cute-stat-label">Submissions</div>
                            </div>
                        </div>

                        {/* System Health & Quick Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {/* System Health */}
                            <div className="cute-card">
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                                    💚 System Health
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)' }}>
                                        <span style={{ fontWeight: '500', color: 'var(--cute-text-dark)' }}>Server</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></span>
                                            Healthy
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)' }}>
                                        <span style={{ fontWeight: '500', color: 'var(--cute-text-dark)' }}>Database</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></span>
                                            Healthy
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)' }}>
                                        <span style={{ fontWeight: '500', color: 'var(--cute-text-dark)' }}>Response Time</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--cute-primary)' }}>{systemHealth.apiResponseTime}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)' }}>
                                        <span style={{ fontWeight: '500', color: 'var(--cute-text-dark)' }}>Uptime</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--cute-secondary)' }}>{systemHealth.uptime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="cute-card">
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                                    ⚡ Quick Actions
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    <button
                                        onClick={() => setShowAddUserModal(true)}
                                        className="btn-cute-secondary"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                                    >
                                        <span style={{ fontSize: '1.8rem' }}>➕</span>
                                        <span style={{ fontSize: '0.875rem' }}>Add User</span>
                                    </button>
                                    <button
                                        onClick={() => setShowSendAlertModal(true)}
                                        className="btn-cute-secondary"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                                    >
                                        <span style={{ fontSize: '1.8rem' }}>📧</span>
                                        <span style={{ fontSize: '0.875rem' }}>Send Alert</span>
                                    </button>
                                    <button
                                        onClick={handleExportData}
                                        className="btn-cute-secondary"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                                    >
                                        <span style={{ fontSize: '1.8rem' }}>📊</span>
                                        <span style={{ fontSize: '0.875rem' }}>Export Data</span>
                                    </button>
                                    <Link
                                        to="/admin/settings"
                                        className="btn-cute-secondary"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', textDecoration: 'none' }}
                                    >
                                        <span style={{ fontSize: '1.8rem' }}>⚙️</span>
                                        <span style={{ fontSize: '0.875rem' }}>Settings</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="cute-card">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                                🕐 Recent Activity
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)', transition: 'all 0.2s' }} className="hover-lift">
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--cute-text-dark)' }}>{activity.action}</span>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--cute-text-light)' }}>{activity.user}</span>
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--cute-text-muted)' }}>{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cute-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cute-text-dark)' }}>User Management</h2>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="cute-input"
                                    style={{ width: 'auto', minWidth: '150px' }}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="student">Students</option>
                                    <option value="mentor">Mentors</option>
                                    <option value="admin">Admins</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="cute-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ minWidth: '200px' }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                <thead>
                                    <tr style={{ background: 'var(--cute-light-bg)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--cute-text-dark)' }}>User</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--cute-text-dark)' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--cute-text-dark)' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--cute-text-dark)' }}>Joined</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--cute-text-dark)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} style={{ background: 'var(--cute-light-bg)', transition: 'all 0.2s' }} className="hover-lift">
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div className="cute-avatar">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'var(--cute-text-dark)' }}>{user.full_name || user.username}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--cute-text-light)' }}>@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--cute-text-dark)' }}>{user.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`cute-badge ${user.user_type === 'admin' ? 'cute-badge-warning' :
                                                    user.user_type === 'mentor' ? '' :
                                                        'cute-badge-success'
                                                    }`}>
                                                    {user.user_type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--cute-text-light)' }}>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <select
                                                    value={user.user_type}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={user.user_type === 'admin'}
                                                    className="cute-input"
                                                    style={{ width: '130px', fontSize: '0.875rem' }}
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="mentor">Mentor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--cute-text-light)' }}>
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers}
                            </span>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="btn-cute-secondary"
                                    style={{ padding: '0.5rem 1.25rem' }}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="btn-cute"
                                    style={{ padding: '0.5rem 1.25rem' }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div className="cute-card">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                                    🎯 Course Completion
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { name: 'Python Fundamentals', value: 85 },
                                        { name: 'JavaScript Mastery', value: 72 },
                                        { name: 'Data Structures', value: 58 }
                                    ].map((course, idx) => (
                                        <div key={idx}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cute-text-dark)' }}>{course.name}</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--cute-primary)' }}>{course.value}%</span>
                                            </div>
                                            <div className="cute-progress-container">
                                                <div className="cute-progress-bar" style={{ width: `${course.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="cute-card">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                                    📊 Platform Stats
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    {[
                                        { label: 'Enrollments', value: '156', icon: '📚' },
                                        { label: 'Active Today', value: '42', icon: '🟢' },
                                        { label: 'Avg. Session', value: '28m', icon: '⏱️' },
                                        { label: 'Success Rate', value: '68%', icon: '✅' }
                                    ].map((stat, idx) => (
                                        <div key={idx} style={{ textAlign: 'center', padding: '1rem', background: 'var(--cute-light-bg)', borderRadius: 'var(--cute-radius-md)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cute-primary)', marginBottom: '0.25rem' }}>{stat.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--cute-text-light)' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddUserModal(false)}>
                    <div className="cute-card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                            ➕ Add New User
                        </h2>
                        <form onSubmit={handleAddUser}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="cute-input"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="cute-input"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="cute-input"
                                        value={newUser.full_name}
                                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="cute-input"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Role *
                                    </label>
                                    <select
                                        required
                                        className="cute-input"
                                        value={newUser.user_type}
                                        onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="mentor">Mentor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn-cute-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-cute">
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send Alert Modal */}
            {showSendAlertModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowSendAlertModal(false)}>
                    <div className="cute-card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--cute-text-dark)' }}>
                            📧 Send Platform Alert
                        </h2>
                        <form onSubmit={handleSendAlert}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Alert Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="cute-input"
                                        placeholder="e.g., Platform Maintenance"
                                        value={announcement.title}
                                        onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        className="cute-input"
                                        rows="5"
                                        placeholder="Enter your message..."
                                        value={announcement.message}
                                        onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                                        style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--cute-text-dark)' }}>
                                        Priority
                                    </label>
                                    <select
                                        className="cute-input"
                                        value={announcement.priority}
                                        onChange={(e) => setAnnouncement({ ...announcement, priority: e.target.value })}
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowSendAlertModal(false)} className="btn-cute-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-cute">
                                    Send Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default AdminPortal;
