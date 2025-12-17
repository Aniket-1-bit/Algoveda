import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/community.css';

export const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);

  // Mock data for community features
  const mockPosts = [
    {
      id: 1,
      title: "Best resources for learning React hooks?",
      author: "Alex Johnson",
      avatar: "AJ",
      timestamp: "2 hours ago",
      replies: 12,
      likes: 24,
      tags: ["React", "JavaScript"],
      content: "I'm trying to get better at React hooks but finding good resources is tough. Any recommendations?"
    },
    {
      id: 2,
      title: "Help with PostgreSQL query optimization",
      author: "Sam Wilson",
      avatar: "SW",
      timestamp: "5 hours ago",
      replies: 8,
      likes: 15,
      tags: ["Database", "PostgreSQL"],
      content: "My query is taking too long to execute. How can I optimize it?"
    },
    {
      id: 3,
      title: "Share your favorite VS Code extensions",
      author: "Taylor Reed",
      avatar: "TR",
      timestamp: "1 day ago",
      replies: 27,
      likes: 42,
      tags: ["Tools", "VS Code"],
      content: "What are your must-have VS Code extensions for web development?"
    }
  ];

  const mockEvents = [
    {
      id: 1,
      title: "JavaScript Algorithms Workshop",
      date: "2023-06-15",
      time: "18:00",
      attendees: 24,
      maxAttendees: 30,
      description: "Hands-on workshop covering common algorithms and data structures in JavaScript"
    },
    {
      id: 2,
      title: "React Best Practices Seminar",
      date: "2023-06-20",
      time: "19:00",
      attendees: 18,
      maxAttendees: 25,
      description: "Learn industry best practices for building scalable React applications"
    }
  ];

  const mockStudyGroups = [
    {
      id: 1,
      name: "Python Beginners Club",
      members: 15,
      maxMembers: 20,
      description: "For those new to Python programming",
      nextMeeting: "Tomorrow, 17:00"
    },
    {
      id: 2,
      name: "Machine Learning Study Group",
      members: 8,
      maxMembers: 12,
      description: "Exploring ML concepts and projects together",
      nextMeeting: "June 18, 16:00"
    },
    {
      id: 3,
      name: "Frontend Frameworks Circle",
      members: 12,
      maxMembers: 15,
      description: "Comparing React, Vue, and Angular",
      nextMeeting: "June 16, 18:00"
    }
  ];

  const mockLeaderboard = [
    { id: 1, name: "Shambhawi", xp: 3200, streak: 25, avatar: "S" },
    { id: 2, name: "Gayatri", xp: 2850, streak: 18, avatar: "G" },
    { id: 3, name: "Khushpreet", xp: 2650, streak: 22, avatar: "K" },
    { id: 4, name: "Nakul", xp: 2400, streak: 15, avatar: "N" },
    { id: 5, name: "Aniket", xp: 2100, streak: 20, avatar: "A" }
  ];

  useEffect(() => {
    setPosts(mockPosts);
    setEvents(mockEvents);
    setStudyGroups(mockStudyGroups);
  }, []);

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {...post, likes: post.likes + 1}
        : post
    ));
  };

  const handleJoinGroup = (groupId) => {
    setStudyGroups(studyGroups.map(group => 
      group.id === groupId 
        ? {...group, members: group.members + 1}
        : group
    ));
  };

  return (
    <div className="community-page">
      {/* Animated Background Elements */}
      <div className="community-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="community-header">
        <h1>👥 Community Hub</h1>
        <p>Connect, collaborate, and grow with fellow learners</p>
      </div>

      <div className="community-tabs">
        <button 
          className={`tab ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          Discussions
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Study Groups
        </button>
        <button 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      <div className="community-content">
        {activeTab === 'discussions' && (
          <div className="discussions-section">
            <div className="section-header">
              <h2>💬 Community Discussions</h2>
              <button className="btn-primary">New Post</button>
            </div>
            
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="avatar">{post.avatar}</div>
                      <div>
                        <div className="author-name">{post.author}</div>
                        <div className="post-time">{post.timestamp}</div>
                      </div>
                    </div>
                    <div className="post-stats">
                      <span className="replies">💬 {post.replies}</span>
                      <span className="likes">👍 {post.likes}</span>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="post-actions">
                    <button className="btn-secondary" onClick={() => handleLikePost(post.id)}>
                      Like
                    </button>
                    <button className="btn-secondary">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h2>📅 Upcoming Events</h2>
              <button className="btn-primary">Create Event</button>
            </div>
            
            <div className="events-list">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    <div className="date">{new Date(event.date).getDate()}</div>
                    <div className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    
                    <div className="event-meta">
                      <span>⏰ {event.time}</span>
                      <span>👥 {event.attendees}/{event.maxAttendees} attending</span>
                    </div>
                    
                    <button className="btn-primary">
                      Join Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="groups-section">
            <div className="section-header">
              <h2>🎓 Study Groups</h2>
              <button className="btn-primary">Create Group</button>
            </div>
            
            <div className="groups-list">
              {studyGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <span className="members">{group.members}/{group.maxMembers} members</span>
                  </div>
                  
                  <p className="group-description">{group.description}</p>
                  
                  <div className="group-meta">
                    <span>📅 Next meeting: {group.nextMeeting}</span>
                  </div>
                  
                  <button 
                    className="btn-primary"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={group.members >= group.maxMembers}
                  >
                    {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <div className="section-header">
              <h2>🏆 Learning Leaderboard</h2>
              <p>Top performers in our community</p>
            </div>
            
            <div className="leaderboard-list">
              {mockLeaderboard.map((person, index) => (
                <div key={person.id} className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}>
                  <div className="leaderboard-rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="leaderboard-user">
                    <div className="avatar">{person.avatar}</div>
                    <div className="user-info">
                      <div className="user-name">{person.name}</div>
                      <div className="user-stats">
                        <span>🔥 {person.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="leaderboard-xp">
                    {person.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};