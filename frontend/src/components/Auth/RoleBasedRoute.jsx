// src/components/Auth/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no tiene el rol permitido
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si tiene permiso, mostrar el contenido
  return children;
};

export default RoleBasedRoute;