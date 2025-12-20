import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const UpcomingLessons = ({ lessons: propLessons }) => {
    // Mock data for upcoming lessons (default student data)
    const initialLessons = [
        {
            id: 1,
            title: "Advanced React Hooks",
            course: "React Mastery",
            time: "Today, 4:00 PM",
            instructor: "Sarah Drasner",
            reminderSet: false
        },
        {
            id: 2,
            title: "Graph Algorithms",
            course: "Data Structures & Algorithms",
            time: "Tomorrow, 2:00 PM",
            instructor: "Aditya Bhargava",
            reminderSet: false
        },
        {
            id: 3,
            title: "System Design Practice",
            course: "System Design Interview Prep",
            time: "Fri, 10:00 AM",
            instructor: "Alex Xu",
            reminderSet: true
        }
    ];

    // Use passed lessons if available, otherwise use initialLessons
    const [lessons, setLessons] = useState(propLessons || initialLessons);

    // Update state if props change (using useEffect to avoid render loop)
    useEffect(() => {
        if (propLessons) {
            setLessons(propLessons);
        }
    }, [propLessons]);

    const toggleReminder = (id) => {
        setLessons(lessons.map(lesson =>
            lesson.id === id ? { ...lesson, reminderSet: !lesson.reminderSet } : lesson
        ));
    };

    return (
        <div className="dashboard-card upcoming-lessons">
            <div className="card-header">
                <h3>📅 Upcoming Lessons</h3>
                <div className="card-icon">🔔</div>
            </div>

            <div className="lessons-list">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="lesson-item">
                        <div className="lesson-date">
                            <span className="date-text">{lesson.time.split(',')[0]}</span>
                            <span className="time-text">{lesson.time.split(',')[1]}</span>
                        </div>
                        <div className="lesson-details">
                            <h4 className="lesson-title">{lesson.title}</h4>
                            <p className="course-name">{lesson.course}</p>
                            <p className="instructor-name">with {lesson.instructor}</p>
                        </div>
                        <div className="lesson-action">
                            <button
                                className={`btn-reminder ${lesson.reminderSet ? 'active' : ''}`}
                                onClick={() => toggleReminder(lesson.id)}
                                title={lesson.reminderSet ? "Remove Reminder" : "Set Reminder"}
                            >
                                {lesson.reminderSet ? '🔔' : '🔕'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="see-all-link">
                <Link to="/schedule" className="btn-secondary">
                    View Full Schedule →
                </Link>
            </div>
        </div>
    );
};
