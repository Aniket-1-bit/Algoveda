import api from './api';

const adminService = {
    getUsers: async (page = 1, limit = 10, search = '') => {
        const response = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    },

    updateUserRole: async (userId, newRole) => {
        const response = await api.put(`/admin/users/${userId}/role`, { user_type: newRole });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};

export default adminService;
