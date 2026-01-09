import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mentorAPI, courseAPI } from '../../services/api';
import '../../styles/dashboard.css';

export const CreateQuiz = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [lessonId, setLessonId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [questions, setQuestions] = useState([
        { id: 1, text: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Check if user is authenticated and is a mentor
    if (!user || user.user_type !== 'mentor') {
        return (
            <div className="dashboard page-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Access Denied</h2>
                <p>You must be logged in as a mentor to create quizzes.</p>
                <button className="btn-primary" onClick={() => navigate('/login')}>Log In</button>
            </div>
        );
    }
    
    // Load courses when component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Get only courses taught by this mentor
                const response = await mentorAPI.getMentorCourses();
                setCourses(response.data);
                
                // Set the first course as selected if available
                if (response.data.length > 0) {
                    setCourseId(response.data[0].id.toString());
                } else {
                    setError('You have no courses yet. Please create a course first before creating a quiz.');
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError('Failed to load courses');
            }
        };
        
        fetchCourses();
    }, []);
    
    // Load lessons when course is selected
    useEffect(() => {
        if (courseId) {
            const fetchLessons = async () => {
                try {
                    const response = await courseAPI.getLessonsByCourse(courseId);
                    setLessons(response.data);
                    if (response.data.length > 0) {
                        setLessonId(response.data[0].id.toString());
                        setError('');
                    } else {
                        setLessonId('');
                        setError('Selected course has no lessons. Please select another course or add lessons to this course first.');
                    }
                } catch (err) {
                    console.error('Failed to fetch lessons:', err);
                    setError('Failed to load lessons');
                }
            };
            
            fetchLessons();
        }
    }, [courseId]);
    
    const handleCourseChange = async (e) => {
        const selectedCourseId = e.target.value;
        setCourseId(selectedCourseId);
        
        if (!selectedCourseId) {
            setLessons([]);
            setLessonId('');
            setError('');
            return;
        }
        
        try {
            const response = await courseAPI.getLessonsByCourse(selectedCourseId);
            setLessons(response.data);
            if (response.data.length > 0) {
                setLessonId(response.data[0].id.toString());
                setError('');
            } else {
                setLessonId('');
                setError('Selected course has no lessons. Please select another course or add lessons to this course first.');
            }
        } catch (err) {
            console.error('Failed to fetch lessons:', err);
            setError('Failed to load lessons for this course');
        }
    };
    
    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleOptionChange = (qId, optionIndex, value) => {
        setQuestions(questions.map(q =>
            q.id === qId ? {
                ...q,
                options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            } : q
        ));
    };

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], correctIndex: 0 }]);
    };

    const removeQuestion = (id) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Transform questions to the format expected by the API
            const transformedQuestions = questions.map((q, index) => ({
                id: index + 1,
                text: q.text,
                options: q.options.filter(opt => opt.trim() !== ''),
                correct_answer: q.correctIndex
            }));
            
            await mentorAPI.createQuiz(lessonId, title, transformedQuestions);
            alert(`Quiz "${title}" created successfully with ${questions.length} questions!`);
            navigate('/mentor-portal');
        } catch (err) {
            console.error('Failed to create quiz:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. You must be a mentor to create quizzes.');
            } else {
                setError(err.response?.data?.message || 'Failed to create quiz. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create New Quiz</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Course and Lesson Selection */}
                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>Course</label>
                            <select
                                required
                                value={courseId}
                                onChange={handleCourseChange}
                                disabled={loading || courses.length === 0}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>Lesson</label>
                            <select
                                required
                                value={lessonId}
                                onChange={(e) => setLessonId(e.target.value)}
                                disabled={loading || lessons.length === 0}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                            >
                                {lessons.map(lesson => (
                                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quiz Title */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>Quiz Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            placeholder="e.g., React Fundamentals Quiz"
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Questions List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {questions.map((q, qIndex) => (
                            <div key={q.id} style={{
                                padding: '1.5rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                background: 'var(--light-bg)',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Question {qIndex + 1}</h3>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(q.id)}
                                            style={{ color: 'var(--error-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter question text..."
                                    value={q.text}
                                    onChange={(e) => handleQuestionChange(q.id, 'text', e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {q.options.map((opt, optIdx) => (
                                        <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="radio"
                                                name={`correct-${q.id}`}
                                                checked={q.correctIndex === optIdx}
                                                onChange={() => handleQuestionChange(q.id, 'correctIndex', optIdx)}
                                                style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                                            />
                                            <input
                                                type="text"
                                                required
                                                placeholder={`Option ${optIdx + 1}`}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(q.id, optIdx, e.target.value)}
                                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                    * Select the radio button next to the correct answer.
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="btn-secondary"
                        style={{ alignSelf: 'center', width: '100%', border: '2px dashed var(--border-color)', padding: '1rem' }}
                    >
                        + Add Another Question
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary" disabled={loading || !lessonId} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            {loading ? 'Creating Quiz...' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
