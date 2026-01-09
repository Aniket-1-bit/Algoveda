import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mentorAPI } from '../../services/api';
import '../../styles/dashboard.css';

export const AwardBadge = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedBadge, setSelectedBadge] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch students from all courses taught by this mentor
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // First, get all courses taught by this mentor
                const coursesResponse = await mentorAPI.getMentorCourses();
                const courses = coursesResponse.data || [];
                
                console.log('Fetched courses:', courses);
                
                if (courses.length === 0) {
                    // Don't set an error, just set empty students
                    setStudents([]);
                    setLoading(false);
                    return;
                }
                                
                // Then get students from each course
                let allStudents = [];
                for (const course of courses) {
                    try {
                        console.log(`Fetching students for course ${course.id}: ${course.title}`);
                        const studentsResponse = await mentorAPI.getCourseStudents(course.id);
                        const courseStudents = studentsResponse.data || [];
                                        
                        console.log(`Found ${courseStudents.length} students in course ${course.title}`);
                
                        // Add course information to each student
                        const studentsWithCourse = courseStudents.map(student => ({
                            ...student,
                            courseName: course.title
                        }));
                                        
                        allStudents = [...allStudents, ...studentsWithCourse];
                    } catch (courseErr) {
                        console.error(`Failed to fetch students for course ${course.id}:`, courseErr);
                        setError(`Failed to fetch students for course: ${course.title}`);
                    }
                }
                                
                console.log('All students before deduplication:', allStudents);
                                
                // Remove duplicates based on student ID
                const uniqueStudents = allStudents.filter((student, index, self) =>
                    index === self.findIndex(s => s.id === student.id)
                );
                                
                console.log('Unique students after deduplication:', uniqueStudents);
                                
                setStudents(uniqueStudents);
                                
                // Don't set an error if no students found - it's a valid scenario
                if (uniqueStudents.length === 0 && !error) {
                    // Optionally set a non-error message if needed, but we handle this in UI
                }
            } catch (err) {
                console.error('Failed to fetch students:', err);
                setError('Failed to load students. Using fallback list. Error: ' + err.message || err.toString());
                
                // Fallback to basic student list
                setStudents([
                    { id: 1, username: 'student1', full_name: 'Student One' },
                    { id: 2, username: 'student2', full_name: 'Student Two' },
                    { id: 3, username: 'student3', full_name: 'Student Three' },
                    { id: 4, username: 'student4', full_name: 'Student Four' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchStudents();
    }, []);

    const badges = [
        { id: 'top-performer', name: '🏆 Top Performer', description: 'Outstanding performance in class' },
        { id: 'code-warrior', name: '⚔️ Code Warrior', description: 'Solved a difficult problem' },
        { id: 'helper', name: '🤝 Community Helper', description: 'Helped peers in discussion' },
        { id: 'bug-hunter', name: '🐛 Bug Hunter', description: 'Found and fixed a critical bug' },
        { id: 'creative', name: '🎨 Creative Mind', description: 'Implemented a unique solution' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudent || !selectedBadge) {
            alert("Please select both a student and a badge.");
            return;
        }

        const student = students.find(s => s.id === parseInt(selectedStudent));
        const badge = badges.find(b => b.id === selectedBadge);
        
        if (!student || !badge) {
            alert("Invalid student or badge selection.");
            return;
        }
        
        try {
            // Call the real API to award the badge
            await mentorAPI.awardBadge(
                parseInt(selectedStudent), 
                badge.name, 
                customMessage || badge.description
            );
            
            alert(`Successfully awarded ${badge.name} to ${student.full_name || student.username}!`);
            navigate('/mentor-portal');
        } catch (err) {
            console.error('Failed to award badge:', err);
            alert('Failed to award badge. Please try again.');
        }
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
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Loading students...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                        <h3>No Students Available</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            You don't have any students enrolled in your courses yet.
                        </p>
                        <div style={{ textAlign: 'left', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
                            <h4>To award badges:</h4>
                            <ol style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
                                <li>Create a course in your portal</li>
                                <li>Ensure students enroll in your course</li>
                                <li>Then you'll be able to award badges to those students</li>
                            </ol>
                        </div>
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/mentor-portal')}
                            style={{ marginTop: '1rem' }}
                        >Go to Mentor Portal</button>
                    </div>
                ) : (
                    <>
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
                                        <option key={s.id} value={s.id}>{s.full_name || s.username} {s.courseName ? `(${s.courseName})` : ''}</option>
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
                    </>
                )}
            </div>
        </div>
    );
};