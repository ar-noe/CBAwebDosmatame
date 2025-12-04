// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, renderizar las rutas hijas
  return <Outlet />;//no uso children
};

export default ProtectedRoute;