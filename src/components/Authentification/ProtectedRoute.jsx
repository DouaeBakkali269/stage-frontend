import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('role'); // Get role from localStorage

  if (!token) {
    return <Navigate to="/" />; // If no token, redirect to login
  }

  // Check if the user's role is allowed to access the route
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to a "not authorized" page or a default dashboard
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
