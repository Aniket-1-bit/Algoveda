import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

// Course endpoints
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  getLessonsByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
};

// Progress endpoints
export const progressAPI = {
  getUserProgress: () => api.get('/progress'),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  getLessonProgress: (userId, lessonId) => api.get(`/progress/${userId}/${lessonId}`),
  startLesson: (lessonId) => api.post('/progress/start', { lessonId }),
  updateProgress: (lessonId, data) => api.put(`/progress/${lessonId}`, data),
  completeLesson: (lessonId) => api.post(`/progress/${lessonId}/complete`),
};

// Code submission endpoints
export const submissionAPI = {
  submitCode: (data) => api.post('/submissions', data),
  getSubmissions: () => api.get('/submissions'),
  getSubmissionById: (id) => api.get(`/submissions/${id}`),
  getLessonSubmissions: (lessonId) => api.get(`/submissions/lesson/${lessonId}`),
  updateSubmissionStatus: (id, data) => api.put(`/submissions/${id}/status`, data),
};

// Gamification endpoints
export const gamificationAPI = {
  getUserStats: () => api.get('/gamification/stats'),
  getUserBadges: () => api.get('/gamification/my-badges'),
  getAllBadges: () => api.get('/gamification/badges'),
  awardBadge: (badgeId) => api.post('/gamification/badges/award', { badgeId }),
  updateXP: (xpAmount) => api.post('/gamification/xp/update', { xpAmount }),
  updateStreak: () => api.post('/gamification/streak/update'),
  getLeaderboard: (limit = 50) => api.get(`/gamification/leaderboard?limit=${limit}`),
};

// Enrollment endpoints
export const enrollmentAPI = {
  enrollCourse: (courseId) => api.post('/enrollments', { courseId }),
  getUserEnrollments: () => api.get('/enrollments'),
  getCourseStatus: (courseId) => api.get(`/enrollments/${courseId}/status`),
  completeCourse: (courseId) => api.post(`/enrollments/${courseId}/complete`),
  unenrollCourse: (courseId) => api.delete(`/enrollments/${courseId}`),
};

// Quiz endpoints
export const quizAPI = {
  getQuizByLesson: (lessonId) => api.get(`/quizzes/lesson/${lessonId}`),
  submitQuiz: (quizId, answers) => api.post('/quizzes/submit', { quizId, answers }),
  getUserResponses: (quizId) => api.get(`/quizzes/${quizId}/responses`),
  getBestScore: (quizId) => api.get(`/quizzes/${quizId}/best-score`),
};

// Challenge endpoints
export const challengeAPI = {
  getTodayChallenge: () => api.get('/challenges/today'),
  submitChallenge: (challengeId, code) => api.post('/challenges/submit', { challengeId, code }),
  getChallengeSolution: (challengeId) => api.get(`/challenges/${challengeId}/solution`),
  createChallenge: (challengeData) => api.post('/challenges', challengeData),
};

// Mentor endpoints
export const mentorAPI = {
  getMentorStats: () => api.get('/mentor/stats'),
  getMentorCourses: () => api.get('/mentor/courses'),
  getCourseStudents: (courseId) => api.get(`/mentor/courses/${courseId}/students`),
  getStudentPerformance: (courseId, studentId) => api.get(`/mentor/courses/${courseId}/students/${studentId}/performance`),
  awardBadge: (studentId, badgeName, badgeDescription) => api.post('/mentor/badges/award', { studentId, badgeName, badgeDescription }),
  awardBonusXP: (studentId, xpAmount, reason) => api.post('/mentor/xp/award', { studentId, xpAmount, reason }),
  createQuiz: (lessonId, title, questions) => api.post('/mentor/quizzes', { lessonId, title, questions }),
};

// Comment endpoints
export const commentAPI = {
  getCommentsByLesson: (lessonId, limit = 50, offset = 0) => api.get(`/comments/lesson/${lessonId}?limit=${limit}&offset=${offset}`),
  createComment: (lessonId, content, parentCommentId = null) => api.post('/comments', { lessonId, content, parent_comment_id: parentCommentId }),
  updateComment: (commentId, content) => api.put(`/comments/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId) => api.post('/comments/like', { comment_id: commentId }),
  unlikeComment: (commentId) => api.post('/comments/unlike', { comment_id: commentId }),
};

// Certificate endpoints
export const certificateAPI = {
  issueCertificate: (courseId) => api.post('/certificates', { course_id: courseId }),
  getUserCertificates: () => api.get('/certificates'),
  getCertificateById: (id) => api.get(`/certificates/${id}`),
  verifyCertificate: (certificateId) => api.get(`/certificates/verify/${certificateId}`),
  downloadCertificate: (id) => api.get(`/certificates/${id}/download`),
};

// Search endpoints
export const searchAPI = {
  searchCourses: (query, filters = {}) => api.get('/search/courses', { params: { query, ...filters } }),
  getSuggestedCourses: (limit = 6) => api.get(`/search/suggested?limit=${limit}`),
  getPopularCourses: (limit = 10) => api.get(`/search/popular?limit=${limit}`),
  getTrendingCourses: (limit = 10, days = 30) => api.get(`/search/trending?limit=${limit}&days=${days}`),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: (unreadOnly = false) => api.get('/notifications', { params: { unread: unreadOnly } }),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Analytics endpoints
export const analyticsAPI = {
  getMentorAnalytics: () => api.get('/analytics/dashboard'),
  getStudentGrowthChart: (days = 30) => api.get(`/analytics/growth?days=${days}`),
  getEngagementMetrics: () => api.get('/analytics/engagement'),
};

export default api;
