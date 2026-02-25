import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

// props: children, requiredRole (optional)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    // not authorized
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
