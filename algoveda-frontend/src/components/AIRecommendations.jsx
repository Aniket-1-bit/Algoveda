import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import '../styles/ai-recommendations.css';

export const AIRecommendations = ({ userInterests, completedCourses, skillLevel }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [userInterests, completedCourses, skillLevel]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate AI recommendations based on user data
      const allCourses = await courseAPI.getAllCourses();
      
      // Filter out already completed courses
      const availableCourses = allCourses.data.filter(course => 
        !completedCourses.includes(course.id)
      );
      
      // Sort by relevance (simulated AI logic)
      const sortedCourses = availableCourses.sort((a, b) => {
        // Higher priority for courses matching user interests
        const interestMatchA = userInterests.some(interest => 
          a.title.toLowerCase().includes(interest.toLowerCase()) ||
          a.description.toLowerCase().includes(interest.toLowerCase())
        );
        
        const interestMatchB = userInterests.some(interest => 
          b.title.toLowerCase().includes(interest.toLowerCase()) ||
          b.description.toLowerCase().includes(interest.toLowerCase())
        );
        
        // Lower difficulty courses for beginners
        const difficultyPriority = {
          'beginner': 1,
          'intermediate': 2,
          'advanced': 3
        };
        
        if (skillLevel === 'beginner' && interestMatchA === interestMatchB) {
          return difficultyPriority[a.difficulty_level] - difficultyPriority[b.difficulty_level];
        }
        
        // Prioritize courses that match interests
        if (interestMatchA && !interestMatchB) return -1;
        if (!interestMatchA && interestMatchB) return 1;
        
        // Otherwise sort by difficulty progression
        return difficultyPriority[a.difficulty_level] - difficultyPriority[b.difficulty_level];
      });
      
      // Return top 3 recommendations
      setRecommendations(sortedCourses.slice(0, 3));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-recommendations">
        <h3>🤖 AI Learning Recommendations</h3>
        <div className="recommendations-loading">
          <p>Analyzing your learning profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <h3>🤖 AI Learning Recommendations</h3>
      <p>Personalized suggestions based on your interests and progress</p>
      
      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((course) => (
            <div key={course.id} className="recommendation-card">
              <div className="recommendation-header">
                <h4>{course.title}</h4>
                <span className={`difficulty ${course.difficulty_level}`}>
                  {course.difficulty_level}
                </span>
              </div>
              <p className="recommendation-description">{course.description}</p>
              <div className="recommendation-meta">
                <span className="hours">⏱️ {course.duration_hours} hours</span>
                <span className="reason">
                  {userInterests.some(interest => 
                    course.title.toLowerCase().includes(interest.toLowerCase())) 
                    ? 'Matches your interests' 
                    : skillLevel === 'beginner' 
                      ? 'Perfect for beginners' 
                      : 'Natural progression'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <p>No personalized recommendations available. Complete some courses to get suggestions!</p>
        </div>
      )}
    </div>
  );
};