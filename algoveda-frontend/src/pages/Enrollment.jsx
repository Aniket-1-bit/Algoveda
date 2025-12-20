import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import '../styles/dashboard.css'; // Reusing dashboard styles for consistency

export const Enrollment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseAPI.getCourseById(courseId);
                setCourse(response.data);
            } catch (err) {
                console.error("Failed to load course", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleEnroll = async () => {
        setProcessing(true);
        try {
            // Simulate API call for payment/enrollment
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Actual enrollment call (if backend supports it, otherwise we just simulate)
            // await enrollmentAPI.enrollCourse(courseId); 

            alert("Enrollment Successful! You can now access all lessons.");
            navigate(`/courses/${courseId}`);
        } catch (err) {
            alert("Enrollment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading enrollment details...</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className="dashboard page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="dashboard-card" style={{ maxWidth: '600px', width: '100%', padding: '3rem' }}>
                <div className="text-center mb-8">
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Enroll in {course.title}</h1>
                    <p style={{ color: 'var(--text-light)' }}>Unlock full access to all lessons, quizzes, and certificates.</p>
                </div>

                <div className="course-summary" style={{ background: 'var(--light-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Course Price:</span>
                        <span style={{ fontWeight: 'bold' }}>$49.99</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green' }}>
                        <span>First Lesson:</span>
                        <span>Free</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span>$49.99</span>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    onClick={() => navigate(`/payment/${courseId}`)}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};
