import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

export const CreateQuiz = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { id: 1, text: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Persistence
        const newQuiz = { id: Date.now(), title, questions, createdAt: new Date().toISOString() };
        const existing = JSON.parse(localStorage.getItem('mentor_quizzes') || '[]');
        localStorage.setItem('mentor_quizzes', JSON.stringify([...existing, newQuiz]));

        alert(`Quiz "${title}" created with ${questions.length} questions!`);
        navigate('/mentor');
    };

    return (
        <div className="dashboard page-container">
            <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>← Back</button>
                <h1>Create New Quiz</h1>
            </div>

            <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Quiz Title */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>Quiz Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            placeholder="e.g., React Fundamentals Quiz"
                            onChange={(e) => setTitle(e.target.value)}
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
                        <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Create Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
