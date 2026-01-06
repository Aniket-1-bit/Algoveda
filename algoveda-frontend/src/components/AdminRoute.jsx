import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.user_type !== 'admin') {
        // Redirect non-admins to home or dashboard
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
